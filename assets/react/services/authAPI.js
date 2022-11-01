import axios from "axios";
import jwtDecode from "jwt-decode";

//permets la deconnexion 
function logout(){
   if(window.localStorage.getItem('authToken') !== null){
    window.localStorage.removeItem('authToken')
    delete axios.defaults.headers["Authorization"]
   }

}


// permets l'autentification
function authenticate(credentials){
  return   axios.post("https://127.0.0.1:8000/api/login_check", credentials)
           .then(res => res.data.token)
           .then(token =>{
              //stocker le token dans le localestorage
              window.localStorage.setItem('authToken', token)

             //prevenir axios de la connexion 
             setAxiosToken(token)
             return true 
           })
}

// verification de la connexion au moment de rechargement de l'application 
 function setup(){
   //verifier si on a un token
   let token = getToken()
   // Verifier si le token n'est pa expirer 
   if(token){
    const jwtData = jwtDecode(token)
     if(jwtData.exp * 1000 > new Date().getTime()){
      setAxiosToken(token) 
       return true
     }else{
       return false
     }
   }else{
     return false
   }
 }
 
  function isConnected(){

  }

   function getToken(){
       return  window.localStorage.getItem('authToken')
  }
 // Rajouter le token à Axios
 function setAxiosToken(token){
    axios.defaults.headers["Authorization"] = "Bearer " + token
 }

export default {
    authenticate,
    logout,
    setup
}