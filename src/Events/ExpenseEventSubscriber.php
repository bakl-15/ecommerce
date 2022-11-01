<?php
namespace App\Events;

use App\Entity\Expense;

use App\Repository\ExpenseRepository;
use App\Repository\InvoiceRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;


class ExpenseEventSubscriber implements EventSubscriberInterface {
   private $security;
   private $rep;
   public function __construct(Security $security, ExpenseRepository $rep)
   {
       $this->security = $security;
       $this->rep = $rep;
   }
    public static function getSubscribedEvents() {
        return [
            KernelEvents::VIEW => ["setUserExpense", EventPriorities::PRE_VALIDATE]
        ];
     }
 

     public function setUserExpense(ViewEvent $event){

    
         $result = $event->getControllerResult();
         $user = $this->security->getUser();
         if(!$user) return;
         //dd($user);
        // dd($this->rep->getLastChrono($user) + 1);
       
         $method = $event->getRequest()->getMethod();
         if (!$result instanceof Expense || Request::METHOD_POST !== $method) {
            return;
        }
        $result->setUser($user) ;
     
         
         
     }  
}