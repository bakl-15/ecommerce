
import React,{useState, useEffect} from 'react'
import Pagination from '../components/Pagination'
import CustomersAPI from '../services/customersAPI'

import { useNavigate, Link} from 'react-router-dom'
import { toast } from 'react-toastify'
import TableLoader from '../components/loaders/TableLoader'
import {BsSearch} from 'react-icons/bs';
import { GrUserAdd,GrTrash } from "react-icons/gr";
// La fonction qui recupere les customers de la base des données
function CustomersPage() {
  const  [customers, setCustomers] = useState([])
  const  [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [order, setOrder] = useState('ASC')
  const navigate = useNavigate()

  // Appel Ajax, recuperation des customers 
const fetchCustomers = async () =>{
    try {
      let data =   await  CustomersAPI.findAll()
      setCustomers(data)
      setIsLoading(false)
    } catch (error) {
      toast.error('Ooops, Une erreur est survenue, veuillez reéssayer 😠')
     
    }
}
 useEffect(()=>{
   fetchCustomers()
},[])

// Fin de la fonction qui recupere les customers de la base des données

//La fonction de la suppression d'un customer
const handleDelete = async id =>{
  const originalCustomer = [...customers]
  
  setCustomers(customers.filter(c => c.id !== id))
  try {
    await CustomersAPI.delete(id)
    toast.success(` Le client a été supprimé avec succés 😃` )
  } catch (error) {
    setCustomers(originalCustomer)
    toast.error('Ooops, Une erreur est survenue, veuillez reéssayer 😠')
     
  }
  /*
  Dexieme façon de faire.
 CustomersAPI.delete()
              .then(rep => console.log(rep))
              .catch(error => setCustomers(originalCustomer))
*/}
//Fin de la fonction de la suppression d'un customer

//Les variable de la paginations
const handleChangePage = (page) =>{
    setCurrentPage(page)
}
const itemPerPage = 8
const filtredCustomers = customers.filter(
    c => c.firstname.toLowerCase().includes(search.toLowerCase()) ||
         c.lastname.toLowerCase().includes(search.toLowerCase()) ||
         c.email.toLowerCase().includes(search.toLowerCase())||
        (c.company &&  c.company.toLowerCase().includes(search.toLowerCase()))
)
const paginatedCustomers = Pagination.getData(filtredCustomers,currentPage,itemPerPage)
// FIn de la partie viable de la pagination


// fonction de la Recherche 
const handleSearch = event => {
  let value = event.currentTarget.value
  setSearch(value)
  setCurrentPage(1) // revenir à  la  premiere page  pendant  la recherche
}


  const getTotalFactures = (customers) =>{

       if(customers){
        return customers.reduce((total, index) =>{
           total = total + index.invoices.length
           return total
        },0)
       }
  }
  /****************** */

  const getAmountTotal = () =>{
    return customers.reduce((total, index) =>{
      total = total + index.amountTotal
      return total
   },0)
  }
  /**************** */

  const sorting = col =>{
   
      if(order === 'ASC'){
        const sorted = [...customers].sort((a,b) =>
        
           a[col].toLowerCase() >   b[col].toLowerCase() ? 1 : -1
        )
        setCustomers(sorted)
        setOrder('DSC')
      }
      if(order === 'DSC'){
        const sorted = [...customers].sort((a,b) =>{
          a[col].toLowerCase() <   b[col].toLowerCase() ? 1 : -1
      })
      setCustomers(sorted)
      setOrder('ASC')
      }
  }
console.log(order)

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
          <h1>Liste des clients </h1>
         
      </div>
      <div className='container mb-2'>
      <div className='row'>
              <div className="col-md-5 border border-success p-2 ml-3" >
                   {/* ---------------------- */}
                   <ul className="list-group">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Nombre de clients
                        <span className="badge bg-primary rounded-pill">{customers.length}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                       Nombre de Factures 
                        <span className="badge bg-primary rounded-pill">{getTotalFactures(customers)}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Montant total
                        <span className="badge bg-primary rounded-pill">{getAmountTotal().toLocaleString()} €</span>
                      </li>
                    </ul>
                   {/* ----------------------- */}
              </div>
              <div className="col-md-7 border border-success p-2">
               <div className="form input-group">
                  
                    <span className="input-group-text"><BsSearch /></span>
                    <input
                        className='form-control'
                        type="text"
                        placeholder='Rechercher...'
                    onChange={handleSearch} value={search} />
                </div>
                  <button onClick={() => navigate("/customers/new")} className="btn btn-outline-secondary mt-4">Créer un client</button>
              </div>
        </div>
      </div> 
     
                                      <table className="table table-hover">
                                            <thead>
                                              <tr>
                                                <th onClick={() => sorting('id')} scope="col">Id</th>
                                                <th onClick={() => sorting('firstname')} scope="col">Client</th>
                                                <th onClick={() => sorting('email')} scope="col">Email</th>
                                                <th onClick={() => sorting('company')} scope="col">Entreprise</th>
                                                <th onClick={() => sorting('invoices')} scope="col">Factures</th>
                                                <th onClick={() => sorting('amountTotal')} scope="col">Montant total</th>
                                                <th  scope="col">Action</th>
                                              </tr>
                                            </thead>


                                            <tbody>
                                            {!isLoading  && 
                                          paginatedCustomers.map(customer =>  <tr key={customer.id} className="table-active">
                                                                                <th scope="row">{customer.id}</th>
                                                                                <td>
                                                                                    <Link to={"/customers/" + customer.id}> {customer.firstname} {customer.lastname}</Link>
                                                                                </td>
                                                                                <td>{customer.email}</td>
                                                                                <td>{customer.company}</td>
                                                                                <td><span className="badge bg-secondary">{customer.invoices.length}</span></td>
                                                                                <td><span className="badge bg-success">{Math.round(customer.amountTotal.toLocaleString(),2)} €</span></td>
                                                                                <td>
                                                                                    <button
                                                                                      disabled={customer.invoices.length > 0}
                                                                                      className='btn btn-danger' 
                                                                                      onClick={() => handleDelete(customer.id)}
                                                                                      > <GrTrash /> </button>
                                                                                </td>
                                                                        </tr>
                                                

                                          )
                                          
                                          }
                                            </tbody>
                                          </table>
                                    { itemPerPage < filtredCustomers.length &&   
                                                  <Pagination currentPage={currentPage}
                                                  itemPerPage={itemPerPage}
                                                  length={filtredCustomers.length}
                                                  onPageChanged={handleChangePage}
                                                    />
                                    } 

      {isLoading &&   <TableLoader />}
    </>
  )
}

export default CustomersPage