
import React,{useState, useEffect} from 'react'
import Pagination from '../components/Pagination'
import ExpenseAPI from '../services/expenseAPI'
//import MaterialTable from 'material-table'

import moment from 'moment'
import { useNavigate, Link} from 'react-router-dom'

import { toast } from 'react-toastify'
import TableLoader from '../components/loaders/TableLoader'
import {BsSearch} from 'react-icons/bs';
import { AiOutlineEdit,AiFillEye } from "react-icons/ai";

//import MaterialTable from 'material-table'
// La fonction qui recupere les expenses de la base des données
function ExpensesPage() {
  const  [expenses, setExpenses] = useState([])
  const  [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [month, setMonth] = useState('')
  const navigate = useNavigate()

  // Appel Ajax, recuperation des expenses 
const fetchExpenses = async () =>{
    try {
      let data =   await  ExpenseAPI.findAll()
      setExpenses(data)
      setIsLoading(false)
    } catch (error) {
      toast.error('Ooops, Une erreur est survenue, veuillez reéssayer 😠')
     
    }
}
 useEffect(()=>{
   fetchExpenses()
},[])

// Fin de la fonction qui recupere les expenses de la base des données

//La fonction de la suppression d'un expense
const handleDelete = async id =>{
  const originalExpense = [...expenses]
  
  setExpenses(expenses.filter(c => c.id !== id))
  try {
    await ExpenseAPI.delete(id)
    toast.success(` Le client a été supprimé avec succés 😃` )
  } catch (error) {
    setExpenses(originalExpense)
    toast.error('Ooops, Une erreur est survenue, veuillez reéssayer 😠')
     
  }
  /*
  Dexieme façon de faire.
 ExpenseAPI.delete()
              .then(rep => console.log(rep))
              .catch(error => setExpenses(originalExpense))
*/}
//Fin de la fonction de la suppression d'un expense

//Les variable de la paginations
const handleChangePage = (page) =>{
    setCurrentPage(page)
}
const itemPerPage = 8
const filtredExpenses = expenses.filter(
    c => c.caption.toLowerCase().includes(search.toLowerCase()) ||
         c.amount.toString().toLowerCase().includes(search.toString().toLowerCase()) ||
         c.tva.toString().toLowerCase().includes(search.toString().toLowerCase())
       
)
const paginatedExpenses = Pagination.getData(filtredExpenses,currentPage,itemPerPage)
// FIn de la partie viable de la pagination


// fonction de la Recherche 
const handleSearch = event => {
  let value = event.currentTarget.value
  setSearch(value)
  setCurrentPage(1) // revenir à  la  premiere page  pendant  la recherche
}

//Fonction qui permet le formatage des dates 
const formatDate = (str) => {
  return  moment(str).format('DD/MM/YYYY')
}
//---------

 const getTvaAmount = () =>{
  if(expenses.length > 0){
    return expenses.reduce((total, item) =>{
      let tva = +item.tvaAmount
    total =  total + tva
    return total
    } ,0)
  }
  
 }
 const getAmountHT = () =>{
  if(expenses.length > 0){
    return expenses.reduce((total, item) =>{
      let price = +item.price
    total =  total + price
    return total
    } ,0)
  }
  
 }
 const getAmountTTC = () =>{
  if(expenses.length > 0){
    return expenses.reduce((total, item) =>{
      let price = +item.amount
    total =  total + price
    return total
    } ,0)
  }
  
 }

 //--------
  // const getOption = () => {
  //   let options =[]
  //   for(let i ; i<= 12;i++){
  //     options.push(`<option value="${i}"> ${i}</option>`)
  //   }
  //   return options
  // }

  // const handleMonthChange = (event) =>{
  //   let value = +event.currentTarget.value
  //   setMonth(value)
  // }
 
  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
          <h1>Liste des depenses </h1>
         
      </div>
  {/* -------------------------------------------------------- */}
  <div className='container mb-4'>
  <div className='row'>
              <div className="col-md-5 border border-success p-2 ml-3" >
                   {/* ---------------------- */}
                   <ul className="list-group">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Montant total en HT
                        <span className="badge bg-primary rounded-pill">{getAmountHT() && getAmountHT().toLocaleString()} €</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                       Montant total TVA
                        <span className="badge bg-primary rounded-pill">{getTvaAmount(expenses) && getTvaAmount(expenses).toLocaleString()} €</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Montant total en TTC
                        <span className="badge bg-primary rounded-pill">{getAmountTTC() && getAmountTTC().toLocaleString()} €</span>
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
                  <button onClick={() => navigate("/expenses/new")} className="btn btn-outline-secondary mt-4">Créer un client</button>
                 
              </div>
        
      </div> 
      </div>
  {/* -------------------------------------------------------- */}
 
     
                                      <table className="table table-hover">
                                            <thead>
                                              <tr>
                                                <th scope="col">Id</th>
                                                <th scope="col">Date d'achat</th>
                                                <th scope="col">Libelé</th>
                            
                                                <th scope="col">TVA</th>
                                                <th scope="col">Montan en TTC</th>
                                                <th scope="col">Type</th>
                                                <th scope="col">Action</th>
                                              </tr>
                                            </thead>


                                            <tbody>
                                            {!isLoading  && 
                                          paginatedExpenses.map(expense =>  <tr key={expense.id} className="table-active">
                                                                                <th scope="row">{expense.id}</th>
                                                                                <td>
                                                                                   {expense.datePayment ? formatDate(expense.datePayment): ''} 
                                                                                </td>
                                                                                <td>{expense.caption}</td>
                                                                                <td>{expense.tvaAmount}</td>
                                                                                <td>{expense.amount.toLocaleString()}</td>
                                                                                <td>{expense.type}</td>
                                                                                <td>
                                                                                    <Link to={"/expenses/" + expense.id} className="btn btn-primary ml-1"><AiOutlineEdit /></Link>
                                                                                    <a className='btn btn-success' href={expense.file}>  <AiFillEye /></a>
                                                                                    <button
                                                                                 
                                                                                      className='btn btn-danger' 
                                                                                      onClick={() => handleDelete(expense.id)}
                                                                                      > x </button>
                                                                                </td>
                                                                        </tr>
                                                

                                          )
                                          
                                          }
                                            </tbody>
                                          </table>
                                    { itemPerPage < filtredExpenses.length &&   
                                                  <Pagination currentPage={currentPage}
                                                  itemPerPage={itemPerPage}
                                                  length={filtredExpenses.length}
                                                  onPageChanged={handleChangePage}
                                                    />
                                    } 

      {isLoading &&   <TableLoader />}


     
    </>
  )
}

export default ExpensesPage