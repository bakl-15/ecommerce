<?php


namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber{
   public function updateJwtData(JWTCreatedEvent $event){
      $data =  $event->getData();
      $user = $event->getUser();
      $data['firstname'] = $user->getFirstname();
      $data['lastname'] = $user->getLastname();
      $event->setData($data);
      
   } 
}