import axios from "axios";

function findAll(){
    return(
            axios
            .get('https://localhost:8000/api/invoices')
            .then(res => res.data["hydra:member"]))
}
function deleteInvoice(id){
    return (
        axios
        .delete('https://localhost:8000/api/invoices/' + id)
    )
}
function findByID(id){
    return axios
    .get("https://localhost:8000/api/invoices/" + id)
    .then(res => res.data)
}

function update(id, invoice){
    return axios.put('https://localhost:8000/api/invoices/' + id , invoice)
}

function create(invoice){
    return axios.post('https://localhost:8000/api/invoices', invoice)
}
export default {
    findAll ,
    findByID,
    create,
    update,
    delete: deleteInvoice
}