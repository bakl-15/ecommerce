<?php
namespace App\Events;
use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoder;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class PasswordEventSubscriber implements EventSubscriberInterface {
   private $passwordEncoder;
   public function __construct(UserPasswordEncoderInterface $encoder )
   {
        $this->passwordEncoder = $encoder;
   }
    public static function getSubscribedEvents() {
        return [
            KernelEvents::VIEW => ["encodePassword", EventPriorities::PRE_WRITE]
        ];
     }

     public function encodePassword(ViewEvent $event){

    
         $result = $event->getControllerResult();
         
         $method = $event->getRequest()->getMethod();
         if (!$result instanceof User || Request::METHOD_POST !== $method) {
            return;
        }
        
             $hash = $this->passwordEncoder->encodePassword($result, $result->getPassword());
             $result->setPassword($hash);
         
         
     }
}