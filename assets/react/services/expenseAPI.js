import axios from "axios";
import Cache from "./cache";

 async function  findAll(){
    const cachedExpenses = await Cache.get("expenses")
     console.log(cachedExpenses)
    if(cachedExpenses) return cachedExpenses
   return axios
        .get('https://localhost:8000/api/expenses')
        .then(res =>{
            const expenses =  res.data["hydra:member"]
            Cache.set('expenses', expenses)
            return expenses
            } )
}
function deleteExpense(id){
    return (
        axios
        .delete('https://localhost:8000/api/expenses/' + id,{ validateStatus: false }).then(
          async res =>  {
           const cachedExpenses = await Cache.get("expenses")

           console.log(cachedExpenses)
            if(cachedExpenses.length > 0){
                Cache.set("expenses", cachedExpenses.filter(c => c.id != id))
            }

             return res
          }
        )
    )
}
function findByID(id){
    return axios
    .get("https://localhost:8000/api/expenses/" + id)
    .then(res => res.data)
}
function update(id, expense){
    return axios.put('https://localhost:8000/api/expenses/' + id , expense).then(
        async res =>  {
         const cachedExpenses = await Cache.get("expenses")

     
          if(cachedExpenses){
            const index = cachedExpenses.findIndex(c => c.id === +id)
            const newcachedExpenses = res.data
            cachedExpenses[index] = newcachedExpenses
              Cache.set("expenses", cachedExpenses)

          }

           return res
        }
      )
}

function create(expense){
    return axios.post('https://localhost:8000/api/expenses', expense).then(
        async res =>  {
         const cachedExpense = await Cache.get("expenses")

        console.log( cachedExpense)
          if(cachedExpense && cachedExpense.length > 0){
              Cache.set("expenses", [...cachedExpense, res.data])
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
    delete: deleteExpense
}