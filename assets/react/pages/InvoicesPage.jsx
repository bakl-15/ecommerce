import axios from 'axios'
import React,{useState, useEffect} from 'react'
import moment from 'moment'
import Pagination from '../components/Pagination'
import invoiceAPI from '../services/invoiceAPI'
import { Link, useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'
import TableLoader from '../components/loaders/TableLoader'
import { AiOutlineEdit,AiFillEye } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import {BsSearch} from 'react-icons/bs';

function InvoicesPage() {

  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const STATUS_CLASSES = {
    paid: "success",
    sent: "info",
    canceled: "warning"

  }
  const trans = {
    paid: "payée",
    sent: "envoyé",
    canceled: "annulée"
  }
  const [invoices, setInvoices] = useState([])
  const  [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  // Pagination 

  //permet la recupération des facture
  const fetchInvoices = async () => {
      try {
        const data =  await invoiceAPI.findAll()
         setInvoices(data) 
         setIsLoading(false)
         
        
      } catch (error) {
        toast.error('Ooops, Une erreur est survenue, veuillez reéssayer 😠')
          
      }
   
    }

  // Affichages des factures au chargement de composant 

    useEffect(() => {
       fetchInvoices()
    }, []);
   //Fonction qui permet le formatage des dates 
    const formatDate = (str) => {
        return  moment(str).format('DD/MM/YYYY')
    }

    const handleChangePage = (page) =>{
      setCurrentPage(page)
  }
  const itemPerPage =8
  // fonction de la Recherche 
  const handleSearch = event => {
    let value = event.currentTarget.value
    setSearch(value)
    setCurrentPage(1) // revenir à  la  premiere page  pendant  la recherche
  }
  const filtredInvoices = invoices.filter(
    i => i.customer.lastname.toLowerCase().includes(search.toLowerCase()) ||
         i.status.toLowerCase().includes(search.toLowerCase()) ||
        i.amount.toString().toLowerCase().includes(search.toLowerCase())
)
const paginatedInvoices = Pagination.getData(filtredInvoices,currentPage,itemPerPage)
// FIn de la partie viable de la pagination

// suppression d'une annonce 
const handleDelete = async id =>{
  const originalInvoices = [...invoices]
  
  setInvoices(invoices.filter(i => i.id !== id))
  try {
    await  invoiceAPI.delete(id)
    toast.success('La facture a été supprimé avec succés 😠')
      
  } catch (error) {
    toast.error('Ooops, Une erreur est survenue, veuillez reéssayer 😠')
         
    setInvoices(originalInvoices)
   
  }
  /*
  Dexieme façon de faire.
 CustomersAPI.delete()
              .then(rep => console.log(rep))
              .catch(error => setCustomers(originalCustomer))
   */}

    /****************** */

  const getAmountTTC = () =>{
    return invoices.reduce((total, index) =>{
      total = total + index.amountTotal
      return total
   },0)
  }
  const getAmountHT = () =>{
    return invoices.reduce((total, index) =>{
      total = total + index.amount
      return total
   },0)
  }
  const getAmountTVA = () =>{
    return invoices.reduce((total, index) =>{
      total = total + ((index.amount * index.tva )/100)
      return total
   },0)
  }
  
  /**************** */

  
  return (
      
    <>
       
         <div className="d-flex justify-content-between align-items-center">
             <h1>Liste des factures </h1>
  
         </div>
         {/* ---------------------------- */}
         <div className='container mb-2'>
      <div className='row'>
              <div className="col-md-5 border border-success p-2 ml-3" >
              
                   <ul className="list-group">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Montant total en HT
                        <span className="badge bg-primary rounded-pill">{getAmountHT().toLocaleString()} €</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                       Montant total en TVA
                        <span className="badge bg-primary rounded-pill">{getAmountTVA().toLocaleString()} €</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Montant total en TTC
                        <span className="badge bg-primary rounded-pill">{getAmountTTC().toLocaleString()} €</span>
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
                        <button onClick={() => navigate("/invoices/new")} className="btn btn-outline-secondary mt-3 mr-5 ">Créer une facture</button>
              </div>
        </div>
      </div> 
         {/* ------------------------------ */}

      
         
         <table className="table table-hover mt-4">
              <thead>
                <tr>
                  <th scope="col">Numéro</th>
                  <th scope="col">Client</th>
                  <th scope="col">Date d'envoi</th>
                  <th scope="col">Date du paiment</th>
                  <th scope="col">Status</th>
                  <th scope="col">TVA</th>
                  <th scope="col">Montant</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              {!isLoading  && 
              <tbody>
           
                  {paginatedInvoices.map(invoice =><tr key={invoice.id}>
                                                <td>{invoice.chrono}</td>
                                                <td> <a href="#">{invoice.customer.firstname} {invoice.customer.lastname}</a></td>
                                                <td>{formatDate(invoice.sentAt)}</td>
                                                <td>{formatDate(invoice.paimentDate)}</td>
                                                <td className='text-center'>
                                                    <span className={'badge bg-' + STATUS_CLASSES[invoice.status]} > {trans[invoice.status.toLowerCase()]}</span>
                                                </td>
                                                <td className='primary'>{((invoice.tva  * invoice.amount)/100).toLocaleString()} €</td>
                                                <td><span className="badge bg-success">{invoice.amountTotal.toLocaleString()} €</span> </td>
                                                <td>
                                                    <Link to={"/invoices/" + invoice.id} className="btn btn-primary ml-1"><AiOutlineEdit /></Link>
                                                    <a className='btn btn-success' href={invoice.file}>  <AiFillEye /></a>
                                                    <button className="btn btn-danger" onClick={() => handleDelete(invoice.id)}><BsTrash /></button>
                                                </td>
                                            </tr>)}
                  
             </tbody>}
        </table>
        { itemPerPage < filtredInvoices.length &&   
                     <Pagination currentPage={currentPage}
                                 itemPerPage={itemPerPage}
                                 length={filtredInvoices.length}
                                 onPageChanged={handleChangePage}
                      />
        } 

{isLoading &&   <TableLoader />}
    </>
    
  )
  
}

export default InvoicesPage