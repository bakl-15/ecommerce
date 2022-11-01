import React, {useState, useEffect} from 'react'
import Select from '../components/forms/Select';
import Field from '../components/forms/Field';
import customersAPI from '../services/customersAPI';
import invoiceAPI from '../services/invoiceAPI';
import { toast } from 'react-toastify'

import {Link, useNavigate, useParams} from 'react-router-dom'
//import "!style-loader!css-loader!antd/dist/antd.css"

function InvoicePage() {
  const params = useParams()
  let id = params.id
  const [isEditing, setIsEditing] = useState(false)

 const [customers, setCustomers] = useState([])
 const navigate = useNavigate()

 const trans = {
  payée:"paid",
  envoyé: "sent",
  annulée:"canceled",
}
  const [invoice, setInvoice] = useState({
      amount:"",
      customer:"",
      status:"sent",
      paimentDate:"",
      tva: "",
      file:""
  });

  const [errors, setErrors] = useState({
      amount:"",
      customer:"",
      status:"",
      paimentDate:"",
      tva: "",
      file:""
})

const fetchCustomers = async () => {
  try {
  
    const data = await customersAPI.findAll()
    setCustomers(data)

    if(!invoice.customer) setInvoice({...invoice, customer: data[0].id})
  } catch (error) {
    toast.error('Ooops, Une erreur est survenue, veuillez reéssayer 😠')
         
  }
}

const fetchInvoice = async idInvoice => {
   try {
     const data = await invoiceAPI.findByID(idInvoice)
    const {amount, customer, status, paimentDate, tva,file} = data
     setInvoice({amount , customer:customer.id , status, paimentDate, tva,file})
   } catch (error) {
  
   }
}

useEffect(()=>{
   fetchCustomers()
},[])

useEffect(()=>{
 
 
  if(id !== "new") {
    fetchInvoice(+id )
    setIsEditing(true)
  } 
 
},[id])


const handleChange = ({currentTarget}) => {

  
  const fileName =""
  const {name, value } = currentTarget

  setInvoice({...invoice, [name]: value})
}

const handleSubmit = async (e) =>{
  
    e.preventDefault()
    
    try {
      const vAmount  = invoice.amount !=="" && +invoice.amount
      const vTva  = invoice.tva !=="" ? +invoice.tva : 0
      const validInvoice = {...invoice, amount:vAmount,tva : vTva, customer: `/api/customers/${invoice.customer}`}
     console.log(validInvoice)
      if(isEditing){
     
        const data =  await  invoiceAPI.update(id, validInvoice)
        toast.success(` La facture a été mise à jour avec succés 😃` )
        navigate('/invoices')
      }else{
        console.log(invoice)
        const data =  await  invoiceAPI.create(validInvoice)
        toast.success(` La facture a été ajouté avec succés 😃` )
        navigate('/invoices')
      }
     
      
    }  catch (error) {


      const apiErrors = []
      
      error.response.data.violations.forEach(violation => {
       apiErrors[violation.propertyPath] = violation.message
       toast.error('Ooops, Une erreur est survenue, veuillez reéssayer 😠')
          
       setErrors(apiErrors)
      })
   }
}

  return (
   <>
   {/* ---------------------- */}


   {/* ----------------------- */}
  

     {/* ----------------------------------------- */}
     <div className='row' style={{marginLeft:"auto", marginRight:"auto"}}>
   <div className='col-md-2'></div>
   <div className="card border-success mb-3 col-md-8 ml-5" style={{maxWidth : '80rem'}}>
                <div className="card-header text-center text-success">  Facture </div>
                <div className="card-body">
              
                {isEditing? <h1>Modification d'une facture </h1>  :<h1>Création d'une facture </h1>}

                  <form onSubmit={handleSubmit}>

                  <Field
                        name="amount"
                        label="Le montant de la facture"
                        placeholder="Entrer le montant de la facture " 
                        type='number'
                        value={invoice.amount}
                        onChange={handleChange}
                        error={errors.amount} 
                  />
                    <Select
                      name="tva"
                      label="Tva"
                      value={invoice.tva}
                      error={errors.tva}
                      onChange={handleChange}

                  >
                  
                  <option value="0"> 0%</option>
                  <option value="5"> 5%</option>
                  <option value="20"> 20%</option>
                      

                  </ Select>
                  <Field
                        name="paimentDate"
                        label="Date de paiement"
                        placeholder="Entrer la date de paiment facture " 
                        type='date'
                        value={invoice.paimentDate}
                        onChange={handleChange}
                        error={errors.paimentDate} 
                  />
                  <Select
                      name="customer"
                      label="Client"
                      value={invoice.customer}
                      error={errors.customer}
                      onChange={handleChange}

                  >
                    {customers.map(customer => <option key={customer.id} value={customer.id}> {customer.firstname} {customer.lastname}</option>)}
                  </ Select>

                  <Select
                      name="status"
                      label="Statut"
                      value={invoice.status}
                      error={errors.status}
                      onChange={handleChange}

                  >
                  <option value=" sent"> envoyé</option>
                  <option value="paid"> payé</option>
                  <option value="canceled"> annulée</option>
                      

                  </ Select>
                 
                  <Field
                        name="file"
                        label="Ajouter une facture"
                        placeholder="Entrer l'URL de votre facture " 
                        type='text'
                        value={invoice.file}
                        onChange={handleChange}
                        error={errors.file} 
                  />
                  <div className="form-group text-center">
                        <button type="submit" className="btn btn-primary">Enregistrer</button>
                          <Link to={"/invoices"} className="btn btn-link"> Retourner</Link>
                        
                  </div>
                  
                  </form>


                </div>
                <div className='col-md-2'></div>
         </div>
      
         </div>
   </>
  )
}

export default InvoicePage