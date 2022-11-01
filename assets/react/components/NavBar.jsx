import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import AuthAPI from '../services/authAPI'
import {AuthenticatedContext}  from '../context/context'
import {Navigate, useNavigate}  from 'react-router-dom'
import { toast } from 'react-toastify'

import {AiOutlineLogout} from 'react-icons/ai';

function NavBar() {
  const {setIsAuthenticated, isAuthenticated} = useContext(AuthenticatedContext)
  const navigate = useNavigate();

 
  
  const handleLogout = () =>{
     toast.info('Vous etes désormais déconnecté, 🔐')
      
      setIsAuthenticated(false)
      AuthAPI.logout()
     
      navigate("/login")

  }
  return (
    <>
     <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <div className="container-fluid">
    <Link to={'/'} className="navbar-brand">BS-Invoices</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarColor02">
      <ul className="navbar-nav me-auto">
        
        <li className="nav-item">
          <Link to={'/customers'} className="nav-link">Clients</Link>
        </li>
        <li className="nav-item">
          <Link to={'/invoices'} className="nav-link">Factures</Link>
        </li>
        <li className="nav-item">
          <Link to={'/expenses'} className="nav-link">Mes dépenses</Link>
        </li>
        
      </ul>
      <ul className='navbar-nav ml-auto'>
        {
         !isAuthenticated && 
              <>
                    <li className="nav-item">
                    <Link to={'/register'} className="nav-link">Inscription</Link>
                </li>
                <li className="nav-item">
                    <Link to={'/login'} className="btn btn-success">Connexion</Link>
                </li>
              
              </>
         ||
              <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-danger"> <AiOutlineLogout /> Deconnexion</button>
              </li>
         
        }
      </ul>
    </div>
  </div>
</nav>
    </>
  )
}

export default NavBar