import React, {useEffect, useState} from 'react'
import Field from '../components/forms/Field'
import { Link } from 'react-router-dom'
import userAPI from '../services/userAPI'
import {useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'
function RegisterPage() {
const navigate = useNavigate()
const [user, setUser] = useState({
  firstname:"",
  lastname:"",
  email:"",
  password:"",
  passwordConfirm:""
})
const [errors, setErrors] = useState({
  firstname:"",
  lastname:"",
  email:"",
  password:"",
  passwordConfirm:""
})
//permets de détecter  les changements des inputs
const handleChange = e => {
  let value = e.currentTarget.value
  let name = e.currentTarget.name
  setUser({...user, [name]: value})

}

  const handleSubmit = async (e) =>{
     e.preventDefault()
     const apiErrors = {}
     if(user.password !== user.passwordConfirm){
       apiErrors.passwordConfirm = "Les mots de passe ne sont pas identique"
       setErrors(apiErrors)
       toast.error('Ooops, Une erreur est survenue, veuillez reéssayer 😠')
       return
      }
    try {
      const data = await userAPI.create(user)
      setErrors({})
      toast.success(`Brvo, votre compte pro a été créé avec succés  😃`)
        
      navigate('/login')
    } catch (error) {
      toast.error('Ooops, Une erreur est survenue, veuillez reéssayer 😠')
        // console.log(error.response.data.violations)
      const {violations} = error.response.data
    
     
      if(violations.length > 0){
    
          violations.forEach(violation => {
          
        apiErrors[violation.propertyPath] = violation.message
        setErrors(apiErrors)
      })
      }
    
    
    }
  }
  return (
    <>
        <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
         <Field
            label="Nom de famille"
            name="lastname"
            value={user.lastname}
            placeholder="entrer votre nom de famille"
            onChange={handleChange}
            type="text"
            error={errors.lastname}
         
         />
        <Field
            label="Prénom"
            name="firstname"
            value={user.firstname}
            placeholder="entrer votre prénom"
            onChange={handleChange}
            type="text"
            error={errors.firstname}
         
         />
      

        <Field
            label="Email"
            name="email"
            value={user.email}
            placeholder="entrer votre email"
            onChange={handleChange}
            type="email"
            error={errors.email}
         
         />
          <Field
            label="Mot de passe"
            name="password"
            value={user.password}
            placeholder="entrer votre mot de passe"
            onChange={handleChange}
            type="password"
            error={errors.password}
         
         />
           <Field
            label="Confirmer le mot de passe"
            name="passwordConfirm"
            value={user.passwordConfirm}
            placeholder="Confirmer le  mot de passe"
            onChange={handleChange}
            type="password"
            error={errors.passwordConfirm}
         
         />
        <div className="form-group">
            <button type="submit" className="btn btn-primary">Enregistrer</button>
             <Link to={"/login"} className="btn btn-link"> J'ai déja un compte</Link>
            
        </div>
      </form>
    </>
   
  )
}

export default RegisterPage