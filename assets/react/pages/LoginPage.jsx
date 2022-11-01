//les  impôrts 
import React,{useState, useContext} from 'react'
import Auth from "../services/authAPI"
import {AuthenticatedContext}  from '../context/context'
import {Navigate, useNavigate}  from 'react-router-dom'
import Field from '../components/forms/Field'
import { toast } from 'react-toastify'

function LoginPage() {
 let navigate = useNavigate()
// les stats 
const [credentials, setCredentials] = useState({
    username:"",
    password:""
});

const [error, setError] = useState('')
const {setIsAuthenticated} = useContext(AuthenticatedContext)
// les fonctions 

//permets de détecter  les changements des inputs
const handleChange = e => {
    let value = e.currentTarget.value
    let name = e.currentTarget.name
    setCredentials({...credentials, [name]: value})
 
}

// permets de submiter le formulaire 
const handleSubmit = async e =>{
    e.preventDefault()
    try {
        
         await Auth.authenticate(credentials)
         setError("")
         setIsAuthenticated(true)
         toast.success('Bienvenu, vous etes connecté sur votre espace pro 😃')
        
         navigate('/')
  
    } catch (error) {
      toast.error('Ooops, Une erreur est survenue, veuillez reéssayer 😠')
       setError('Les identifiants ne correspondent à aucun compte')
    }
}
  return (
   <>
    <div className='jumbotron bg-light p-5 text-center mb-5'>
        <div className='display-3'>BS Service Plus </div>
        <div className='lead'>BS-INVOICE est une application de géstion des factures </div>
    </div>
     
    <div className="container">
     
     <div className="row">
            <div className="col-md-3">
            </div>
            <div className="col-md-6 border border-success p-5">
            <h4 className='text-center'>Se connecter à l'application</h4>
                    <form onSubmit={handleSubmit}>
                        <Field
                          label="Adresse email"
                          name="username"
                          value={credentials.username}
                          placeholder="entrer votre adresse email"
                          onChange={handleChange}
                          type="email"
                          error={error}
                        
                        />
                        
                        <Field
                          label="Mot de passe"
                          name="password"
                          value={credentials.password}
                          placeholder="entrer votre mot de passe"
                          onChange={handleChange}
                          type="password"
                          error={error}
                        
                        />  
                            
                           
                              <button type='submit' className="form-control btn btn-success m-2"> Se connecter</button>
                         
                        </form>
              
            </div>
            <div className="col-md-3">
            </div>
     </div>

    </div>
        
   </>
  )
}

export default LoginPage