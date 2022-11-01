import React, {useState, useEffect} from 'react'
import Field from '../components/forms/Field'
import Select from '../components/forms/Select'
import {Link, useParams, useLocation,useNavigate} from 'react-router-dom'
import axios from 'axios'
import expensesAPI from '../services/expenseAPI'
import { toast } from 'react-toastify'
function ExpensePage() {
   
    const params = useParams()
    let id = params.id
    const [isEditing, setIsEditing] = useState(false)
    const navigate = useNavigate()

    const fetchExpense = async id => {
        try {
            const  { price, caption, tva, type,datePayment,file } =  await expensesAPI.findByID(id)
    
            setExpense({  price, caption, tva, type, datePayment, file  })
       
        } catch (error) {
            toast.error('Ooops, Une erreur est survenue, veuillez reéssayer 😠')
           console.log(error)
        }
       
    }
    useEffect(() => {
      if(id !== 'new') {
          setIsEditing(true)
          fetchExpense(id)
      }
    }, [id]);
  
  
   // const location = useLocation()
 //price, caption, tva, type,datePayment,file
    const [expense, setExpense] = useState({
        price:"",
        caption:"",
        tva:"",
        type:"",
        datePayment:"null",
        file:""
    })
     const [errors, setErrors] = useState({
        price:"",
        caption:"",
        tva:"",
        type:"",
        datePayment:"",
        file:""
    })

    const handleChange = ({currentTarget}) => {
            const {name, value } = currentTarget
            setExpense({...expense, [name]: value})
    }
 
    const handleSubmit = async  e =>{
        e.preventDefault()
        console.log(isEditing)
        try {
            const vAmount  = expense.price !=="" && +expense.price
            const vTva  = expense.tva !=="" ? expense.tva = 0 : +expense.tva
            const validExpense = {...expense, price:vAmount,tva : vTva}
          
            if(isEditing){
                const res = await expensesAPI.update(id, validExpense)
                toast.success(` La facture  a été mis à jour avec succés 😃` )
                navigate('/expenses')
            }{
                const res = await expensesAPI.create(validExpense)
                toast.success(` La facture a été créé à jour avec succés 😃` )
                navigate('/expenses')
            }
           
           setErrors({})
        } catch (error) {
            
           const apiErrors = []
           error.response.data.violations.forEach(violation => {
            apiErrors[violation.propertyPath] = violation.message
            setErrors(apiErrors)
          
            toast.error('Ooops, Une erreur est survenue, veuillez reéssayer 😠')
       
           })
        }
    }
  return (
      <>
      <h1 className='mb-3'>Ajouter une facture </h1>
     
   <div className='row' style={{marginLeft:"auto", marginRight:"auto"}}>
   <div className='col-md-2'></div>
   <div className="card border-success mb-3 col-md-8 ml-5" style={{maxWidth : '80rem'}}>
                <div className="card-header text-center text-success">Facture</div>
                <div className="card-body">
                <form onSubmit={handleSubmit}>
                            <Field
                                name="price"
                                label="Le montant en HT"
                                placeholder="Entrer le montant en HT "
                                value={expense.price}
                                onChange={handleChange} 
                                type="number"
                                error={errors.price}/>
                              <Field
                                name="caption"
                                label="Le libelé de la facture "
                                placeholder="Entrer Le libelé de la facture "
                                value={expense.caption}
                                onChange={handleChange} 
                                type="text"
                                error={errors.price}/>
                             <Field
                                name="datePayment"
                                label="Date d'achat"
                                placeholder="Entrer la Date d'achat "
                                value={expense.datePayment}
                                onChange={handleChange} 
                                type="date"
                                error={errors.datePayment}/>
                            <Select
                                                name="tva"
                                                label="Tva"
                                                value={expense.tva}
                                                error={errors.tva}
                                                onChange={handleChange}

                                            >
                                            
                                            <option value="0"> 0%</option>
                                            <option value="5"> 5%</option>
                                            <option value="20"> 20%</option>
                      

                           </ Select>
                           <Select
                                                name="type"
                                                label="Le type"
                                                value={expense.type}
                                                error={errors.type}
                                                onChange={handleChange}

                                            >
                                            
                                            <option value="Ticket"> Ticket</option>
                                            <option value="Facture"> Facture</option>
                                            <option value=" URSAF"> URSAF</option>
                                            <option value="Salaire gérant"> Salaire gérant</option>
                                            
                      

                           </ Select>
                           <Field
                                name="file"
                                label="La facture"
                                placeholder="Entrer l'URL de la facture "
                                value={expense.file}
                                onChange={handleChange} 
                                type="text"
                                error={errors.text}/>

                            <div className="form-group">
                                <button type="submit" className="btn btn-primary mt-2">Enregistrer</button>
                                <Link to={"/expenses"} className="btn btn-link"> Retourner</Link>
                                
                            </div>
                    </form> 
                 
                </div>
                <div className='col-md-2'></div>
         </div>
 
         </div>
    </>
  )
}

export default ExpensePage