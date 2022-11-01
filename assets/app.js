// import pour react
  import React, { useState} from 'react'
  import ReactDOM from 'react-dom'
// any CSS you import will output into a single css file (app.css in this case)


import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
//import './styles/toasify.scss'
import './styles/style.css';



// start the Stimulus application
import './bootstrap';

import NavBar from './react/components/NavBar';
import HomePage from './react/pages/HomePage';
import ExpensePage from './react/pages/ExpensePage';
import ExpensesPage from './react/pages/ExpensesPage';
import { BrowserRouter as Router ,Routes,Route, HashRouter } from 'react-router-dom';
import CustomersPage from './react/pages/CustomersPage';
import InvoicesPage from './react/pages/InvoicesPage';
import LoginPage from './react/pages/LoginPage';
import authAPI  from './react/services/authAPI';
import CustomerPage from './react/pages/CustomerPage';
import { AuthenticatedContext } from './react/context/context';
import InvoicePage from './react/pages/InvoicePage'
import RegisterPage from './react/pages/RegisterPage'
import "!style-loader!css-loader!react-toastify/dist/ReactToastify.css"

//toast.configure()
 
const App = () =>{
 
  const isConnected = authAPI.setup()
  const [isAuthenticated, setIsAuthenticated] = useState(isConnected)


  return (
    <>
    <AuthenticatedContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
     <HashRouter>
        <NavBar />
        <div className='container pt-5'>
         
              <Routes>
              <Route path="/register"  element={isAuthenticated ? <CustomersPage />: <RegisterPage />} />
                   <Route path="/login"  element={isAuthenticated ? <CustomersPage />: <LoginPage />} />
                   <Route path="/customers"  element={isAuthenticated ? <CustomersPage /> : <LoginPage />} />
                   <Route path="/customers/:id"  element={isAuthenticated ? <CustomerPage /> : <LoginPage />} />
                   <Route path="/invoices/:id"  element={isAuthenticated ? <InvoicePage /> : <LoginPage />} />
                   <Route path="/expenses"  element={isAuthenticated ? <ExpensesPage /> : <LoginPage />} />
                   <Route path="/expenses/:id"  element={isAuthenticated ? <ExpensePage /> : <LoginPage />} />
                   <Route path="/invoices"  element={isAuthenticated ? <InvoicesPage /> : <LoginPage />} />
                   <Route path="/"  element={isAuthenticated ? <HomePage /> : <LoginPage />} />
                  
              </Routes>
        
        </div>
      </HashRouter>
  
  </AuthenticatedContext.Provider>
  <ToastContainer position={toast.POSITION.TOP_CENTER} />
    </>
  )
}
const rootElement =  document.getElementById('app')
ReactDOM.render(<App />, rootElement)
 