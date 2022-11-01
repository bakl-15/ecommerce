<?php
namespace App\Events;

use App\Entity\Invoice;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Repository\InvoiceRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;


class InvoiceEventSubscriber implements EventSubscriberInterface {
   private $security;
   private $rep;
   public function __construct(Security $security, InvoiceRepository $rep)
   {
       $this->security = $security;
       $this->rep = $rep;
   }
    public static function getSubscribedEvents() {
        return [
            KernelEvents::VIEW => ["setChrono", EventPriorities::PRE_VALIDATE]
        ];
     }
 

     public function setChrono(ViewEvent $event){

    
         $result = $event->getControllerResult();
         $user = $this->security->getUser();
         if(!$user) return;
         //dd($user);
        // dd($this->rep->getLastChrono($user) + 1);
         $nextChrono = $this->rep->getLastChrono($user) + 1;
         $method = $event->getRequest()->getMethod();
         if (!$result instanceof Invoice || Request::METHOD_POST !== $method) {
            return;
        }
        
         $result->setChrono($nextChrono);
         
       
         if(empty($result->getSentAt())){
             $result->setSentAt(new \DateTime());
         }
         
         
     }  
}



      