<?php
namespace App\Events;
use App\Entity\User;
use App\Entity\Customer;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;


class CustomerUserSubscriber implements EventSubscriberInterface {
   private $security;
   public function __construct(Security $security)
   {
       $this->security = $security;
   }
    public static function getSubscribedEvents() {
        return [
            KernelEvents::VIEW => ["setUserToCustomer", EventPriorities::PRE_VALIDATE]
        ];
     }

     public function setUserToCustomer(ViewEvent $event){

    
         $result = $event->getControllerResult();
         $user = $this->security->getUser();
         $method = $event->getRequest()->getMethod();
         if (!$result instanceof Customer || Request::METHOD_POST !== $method) {
            return;
        }
        
        $result->setUser($user) ;
         
     
         
     }
}