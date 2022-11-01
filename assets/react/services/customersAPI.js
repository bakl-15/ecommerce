import axios from "axios";
import Cache from "./cache";

 async function  findAll(){
    const cachedCustomers = await Cache.get("customers")
     console.log(cachedCustomers)
    if(cachedCustomers) return cachedCustomers
   return axios
        .get('https://localhost:8000/api/customers')
        .then(res =>{
            const customers =  res.data["hydra:member"]
            Cache.set('customers', customers)
            return customers
            } )
}
function deleteCustomer(id){
    return (
        axios
        .delete('https://localhost:8000/api/customers/' + id,{ validateStatus: false }).then(
          async res =>  {
           const cachedCustomers = await Cache.get("customers")

           console.log(cachedCustomers)
            if(cachedCustomers.length > 0){
                Cache.set("customers", cachedCustomers.filter(c => c.id != id))
            }

             return res
          }
        )
    )
}
function findByID(id){
    return axios
    .get("https://localhost:8000/api/customers/" + id)
    .then(res => res.data)
}
function update(id, customer){
    return axios.put('https://localhost:8000/api/customers/' + id , customer).then(
        async res =>  {
         const cachedCustomers = await Cache.get("customers")

     
          if(cachedCustomers){
            const index = cachedCustomers.findIndex(c => c.id === +id)
            const newcachedCustomers = res.data
            cachedCustomers[index] = newcachedCustomers
              Cache.set("customers", cachedCustomers)

          }

           return res
        }
      )
}

function create(customer){
    return axios.post('https://localhost:8000/api/customers', customer).then(
        async res =>  {
         const cachedCustomers = await Cache.get("customers")

          if(cachedCustomers.length > 0){
              Cache.set("customers", [...cachedCustomers, res.data])
          }

           return res
        }
      )
}
export default {
    findAll ,
    findByID,
    create,
    update,
    delete: deleteCustomer
}