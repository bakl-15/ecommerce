import React, {useState, useEffect} from 'react'
import Field from '../components/forms/Field'
import {Link, useParams, useLocation,useNavigate} from 'react-router-dom'
import axios from 'axios'
import customersAPI from '../services/customersAPI'
import { toast } from 'react-toastify'
function CustomerPage(props) {
   
    const params = useParams()
    let id = params.id
    const [isEditing, setIsEditing] = useState(false)
    const navigate = useNavigate()

    const fetchCustomer = async id => {
        try {
            const  { firstname, lastname, email, company } =  await customersAPI.findByID(id)
    
            setCustomer({ firstname, lastname, email, company })
       
        } catch (error) {
            toast.error('Ooops, Une erreur est survenue, veuillez reéssayer 😠')
     
        }
       
    }
    useEffect(() => {
      if(id !== 'new') {
          setIsEditing(true)
          fetchCustomer(id)
      }
    }, [id]);

  
   // const location = useLocation()
 
    const [customer, setCustomer] = useState({
        lastname:"",
        firstname:"",
        email:"",
        company:""
    })
     const [errors, setErrors] = useState({
        lastname:"",
        firstname:"",
        email:"",
        company:""
    })

    const handleChange = ({currentTarget}) => {
            const {name, value } = currentTarget
            setCustomer({...customer, [name]: value})
    }

    const handleSubmit = async  e =>{
        e.preventDefault()
        try {
      
            if(isEditing){
                const res = await customersAPI.update(id, customer)
                toast.success(` Le client a été mis à jour avec succés 😃` )
                navigate('/customers')
            }{
                const res = await customersAPI.create(customer)
                toast.success(` Le client a été créé à jour avec succés 😃` )
                navigate('/customers')
            }
           
           setErrors({})
        } catch (error) {
           const apiErrors = []
           error.response.data.violations.forEach(violation => {
            apiErrors[violation.propertyPath] = violation.message
            setErrors(apiErrors)
            toast.error('Ooops, Une erreur est survenue, veuillez reéssayer 😠')
            console.log(error)
           })
        }
    }
  return (
      <>
      <h1 className='mb-3'>Ajouter un client </h1>
     
   <div className='row' style={{marginLeft:"auto", marginRight:"auto"}}>
   <div className='col-md-2'></div>
   <div className="card border-success mb-3 col-md-8 ml-5" style={{maxWidth : '80rem'}}>
                <div className="card-header text-center text-success">Nouveau client</div>
                <div className="card-body">
                <form onSubmit={handleSubmit}>
                            <Field
                                name="lastname"
                                label="Prénom"
                                placeholder="Entrer le prénom de client "
                                value={customer.lastname}
                                onChange={handleChange} 
                                error={errors.lastname}/>

                            <Field
                                name="firstname"
                                label="nom"
                                placeholder="Entrer le nom de client " 
                                value={customer.firstname}
                                onChange={handleChange}
                                error={errors.firstname} />
                            <Field
                                name="email"
                                label="Email"
                                placeholder="Entrer l'Email de client" 
                                type="email"
                                value={customer.email}
                                onChange={handleChange}
                                error={errors.email} />
                            <Field
                                name="company"
                                label="L'entreprise"
                                placeholder="Entrer le Nom de l'entreprise " 
                                value={customer.company}
                                onChange={handleChange}
                                error={errors.company} />
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary mt-2">Enregistrer</button>
                                <Link to={"/customers"} className="btn btn-link"> Retourner</Link>
                                
                            </div>
                    </form> 
                 
                </div>
                <div className='col-md-2'></div>
         </div>
 
         </div>
    </>
  )
}

export default CustomerPage