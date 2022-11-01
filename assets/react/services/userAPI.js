import axios from "axios";

function findAll(){
    return(
            axios
            .get('https://localhost:8000/api/users')
            .then(res => res.data["hydra:member"]))
}
function deleteCustomer(id){
    return (
        axios
        .delete('http://localhost:8000/api/users/' + id,{ validateStatus: false })
    )
}
function findByID(id){
    return axios
    .get("https://localhost:8000/api/users/" + id)
    .then(res => res.data)
}

function update(id, user){
    return axios.put('https://localhost:8000/api/users/' + id , user)
}

function create(user){
    return axios.post('https://127.0.0.1:8000/api/users', user)
}

function connectedUser(){
    return axios
    .get("https://127.0.0.1:8000/api/user/connected")
    .then(res => res.data)
}
export default {
    findAll ,
    findByID,
    create,
    update,
    delete: deleteCustomer,
    connectedUser
}