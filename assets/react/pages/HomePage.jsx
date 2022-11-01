
import React from 'react'
import { useState, useEffect } from 'react'

import UserAPI from '../services/userAPI'
import imageClients from '../images/clients.png'
import {FaUsers, FaFileInvoiceDollar, SiExpensify} from 'react-icons/fa';
import {BsFillBagCheckFill} from 'react-icons/bs';
import {AiOutlineCloseCircle, AiOutlineCheck, AiOutlineDeliveredProcedure} from 'react-icons/ai';
import { MdOutlineArrowCircleUp, MdOutlineArrowCircleDown,MdOutlineAspectRatio } from "react-icons/md"
import MainGraph from '../components/graphs/MainGraph';
import MainGraph1 from '../components/graphs/MainGraph1';
const HomePage = () => {

const [connectedUser, setConnectedUser] = useState(0)
const [dataGraphTotal, setDataGraphTotal] = useState([])
const [dataGraphPaid, setDataGraphPaid] = useState([])
const [dataGraphNoPaid, setDataGraphNoPaid] = useState([])
const fetchCustomers = async() =>{
  let data =   await  UserAPI.connectedUser()
  setConnectedUser(data)
  setDataGraphTotal(data.dataGraphTotal)
  setDataGraphPaid(data.dataGraphPaid)
  setDataGraphNoPaid(data.dataGraphNotPaid)
}
  useEffect(() =>{
    fetchCustomers()
  },[])


function getIndex(d){
  let tt=[]
  for(let g in d){
  tt.push(g)
  }
  return tt
};
function getValue(d){
  let tt=[]
  for(let g in d){
  tt.push(d[g])
  }
  return tt
};

function getCumul(d){
  let tt=[]
  let cumul = 0
  for(let g in d){
    cumul = cumul +  d[g]
     tt.push(cumul.toLocaleString())
  }
  return tt
}
console.log(dataGraphTotal)
  
  return (
    <>
    <div className='jumbotron bg-light p-5 text-center mb-5'>
        <div className='lead'>Bilan 2022 ( Chiffre d'affaire en cours ) ✔️  </div>
        <div className='display-3 text-success'>{connectedUser.amountTotalInvoice && connectedUser.amountTotalInvoice.toLocaleString()} €  </div>
       <div className="row">
           <div className="col-md-6">
               <MainGraph index={getIndex(dataGraphTotal)} value={getValue(dataGraphTotal)} />
           </div>
           <div className="col-md-6">
              <MainGraph1 index={getIndex(dataGraphTotal)} value={getCumul(dataGraphTotal)}  />
           </div>
       </div>
       
    </div>

             {/* **************************** */}
  <div className='container'>

  <div className='row d-flex justify-content-around mb-5 border border-primary p-4' >
        <h1 className='mb-4'>Les montants totaux .</h1>
        <div className="card border-success mb-3 col-md-3 ml-5 " style={{maxWidth : '20rem'}}>
                <div className="card-header text-center text-success"><AiOutlineCheck size={55}/></div>
                <div className="card-body">
                <p className="card-text text-center text-success text-bold"><strong>Montant total des factures encaissées (TTC)</strong></p>
                  <h1 className="text-center text-success"><strong>{connectedUser.amountTotalInvoicePaid && connectedUser.amountTotalInvoicePaid.toLocaleString()} € </strong></h1>
                 
                </div>
         </div>
        <div className="card border-light mb-3 col-md-3 ml-5 " style={{maxWidth : '20rem'}}>
                <div className="card-header text-center text-light"><AiOutlineDeliveredProcedure size={55}/></div>
                <div className="card-body">
                <p className="card-text text-center text-light text-bold"><strong>Montant total des factures non encaissées (TTC)</strong></p>
                  <h1 className="text-center text-light"><strong>{connectedUser.amountTotalInvoiceNotPaid && connectedUser.amountTotalInvoiceNotPaid.toLocaleString()} € </strong></h1>
                 
                </div>
                
         </div>
           <div className="card border-danger mb-3 col-md-3 ml-5 " style={{maxWidth : '20rem'}}>
                <div className="card-header text-center text-danger"><AiOutlineCloseCircle size={55}/></div>
                <div className="card-body">
                <p className="card-text text-center text-danger text-bold"><strong>Montant total des factures annulées (TTC)</strong></p>
                  <h1 className="text-center text-danger"><strong>{connectedUser.amountTotalInvoiceNotPaid && connectedUser.amountTotalInvoiceNotPaid.toLocaleString()} € </strong></h1>
                 
                </div>
         </div>
  </div>
  <div className='row d-flex justify-content-around mb-5 border border-light p-4' >
       <h1 className='mb-4'>Les TVA .</h1>
       <div className="card border-light mb-3 col-md-3 ml-5 " style={{maxWidth : '20rem'}}>
                <div className="card-header text-center text-light">< MdOutlineArrowCircleUp size={55}/></div>
                <div className="card-body">
                <p className="card-text text-center text-light text-bold"><strong>Montant total de la tva payée (TTC)</strong></p>
                  <h1 className="text-center text-light"><strong>{connectedUser.expenseTva && connectedUser.expenseTva.toLocaleString()} € </strong></h1>
                 
                </div>
         </div>
        <div className="card border-light mb-3 col-md-3 ml-5 " style={{maxWidth : '20rem'}}>
                <div className="card-header text-center text-light"><MdOutlineArrowCircleDown size={55}/></div>
                <div className="card-body">
                <p className="card-text text-center text-light text-bold"><strong>Montant total de la tva encaissée (TTC)</strong></p>
                  <h1 className="text-center text-light"><strong>{connectedUser.amountTvaInvoice && connectedUser.amountTvaInvoice.toLocaleString()} € </strong></h1>
      
                </div>
         </div>
         <div className="card border-light mb-3 col-md-3 ml-5 " style={{maxWidth : '20rem'}}>
                <div className="card-header text-center text-light"><MdOutlineAspectRatio size={55}/></div>
                <div className="card-body">
                <p className="card-text text-center text-light text-bold"><strong>Montant total de la tva deduite</strong></p>
                  <h1 className="text-center text-light"><strong>{connectedUser.tva && connectedUser.tva.toLocaleString()} € </strong></h1>
                 
                </div>
         </div>
         
  </div>
     <div className='row d-flex justify-content-around mb-5 border border-light p-4' >
     <h1 className='mb-4'>Les statistiques .</h1>
          <div className="card border-primary mb-3 col-md-3 ml-5 " style={{maxWidth : '20rem'}}>
                <div className="card-header text-center text-primary"><FaUsers size={55}/></div>
                <div className="card-body">
                 
                  <h1 className="text-center text-primary"><strong>{connectedUser.customerCount}</strong></h1>
                  <p className="card-text text-center text-primary text-bold"><strong>Clients enregistrés</strong></p>
                </div>
         </div>
         <div className="card border-primary mb-3 col-md-3 ml-5 " style={{maxWidth : '20rem'}}>
                <div className="card-header text-center text-primary"><FaFileInvoiceDollar size={55}/></div>
                <div className="card-body">
                 
                  <h1 className="text-center text-primary"><strong>{connectedUser.invoiceCount}</strong></h1>
                  <p className="card-text text-center text-primary text-bold"> <strong>Factures enregistrés</strong></p>
                </div>
         </div>
         <div className="card border-primary mb-3 col-md-3 ml-5 " style={{maxWidth : '20rem'}}>
                <div className="card-header text-center text-primary"><BsFillBagCheckFill size={55}/></div>
                <div className="card-body">
                 
                  <h1 className="text-center text-primary"><strong>{connectedUser.expenseCount}</strong></h1>
                  <p className="card-text text-center text-primary text-bold"> <strong>Factures d'Achat enregistrés</strong></p>
                </div>
         </div>
        
   </div>
          
        
    </div>

         {/* ***************************** */}
    </>
  )
}

export default HomePage