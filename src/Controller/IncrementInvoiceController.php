<?php
//  l'authentification 
// installer lexikAuthentificationJWTBundle modifier le fichier .env
//rajouter un fichier config/lexik-jwt-authentificator.ymal
//instaler openssl
// Créer un dossier config/jwt
//génerer une clé privée private key
//                     openssl genrsa --out config/jwt/private.pem -aes256 4096 
//génerer une clé public :
//                         openssl rsa -pubout in config/jwt/private.pem -out config/jwt/public.pem 
//configurer le fichier security.yaml
    // login:
   // pattern: ^/api/login
   // stateless: true
    //json_login:
        //check_path: /api/login_check # or api_login_check as defined in config/routes.yaml
       // success_handler: lexik_jwt_authentication.handler.authentication_success
       // failure_handler: lexik_jwt_authentication.handler.authentication_failure                  

/**
 * configurer rout.yaml
 * rajouter la route 
 * api_login_check:
   * path: /api/login_check
 */
       
       
namespace App\Controller;

use App\Entity\Invoice;
use Doctrine\ORM\EntityManagerInterface;

class IncrementInvoiceController{
    private $em;

    public function __construct(EntityManagerInterface $em){
        $this->em = $em;
    }
    public function __invoke(Invoice $data)
    {
        $data->setChrono($data->getChrono() + 1 );
        $this->em->flush();
        return $data ;
    }


}