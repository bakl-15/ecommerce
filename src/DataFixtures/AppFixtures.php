<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Expense;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    private $encoder;
    public function __construct(UserPasswordEncoderInterface $encoder){
        $this->encoder = $encoder;
    }
    public function load(ObjectManager $manager)
    {

        // $product = new Product();
        // $manager->persist($product);
       $faker = Factory::create('FR-fr');

       for($u = 0;$u <15; $u++){
          $user = new User();
          $hash = $this->encoder->encodePassword($user,'password');
           $chrono = 1;
           $user->setFirstname($faker->firstName())
               ->setEmail($faker->email)
               ->setLastname($faker->lastName)
               ->setPassword($hash);
           $manager->persist($user);
           for($i=0; $i<mt_rand(5,20);$i++){
            $expense = new Expense();
            $expense->setPrice($faker->numberBetween(100,1000))
                    ->setCaption($faker->paragraph())
                    ->setTva($faker->randomElement([0,5,20]))
                    ->setUser($user)
                    ->setType($faker->randomElement(['Facture','Ticket']))
                    ->setPurchaseDate(new \dateTime($faker->date))
          ; 
          $manager->persist($expense);
        }
           for($i=0; $i<mt_rand(5,20);$i++){
               $customer = new Customer();
               $customer->setLastname($faker->lastName)
                   ->setFirstname($faker->firstName)
                   ->setEmail($faker->email)
                   ->setCompany($faker->company)
                   ->setUser($user);
               $manager->persist($customer);
               for($j =0; $j< mt_rand(3,10); $j++){
                   $invoice = new Invoice();
                   $invoice->setAmount($faker->randomFloat(2,250,5000))
                       ->setSentAt($faker->dateTimeBetween('- 6months'))
                       ->setStatus($faker->randomElement(['sent','paid','canceled']))
                       ->setCustomer($customer)
                       ->setPaimentDate(new \datetime($faker->date))
                       ->setTva($faker->randomElement([0,5,20]))
                       ->setChrono($chrono);
                   $chrono++;
                   $manager->persist($invoice);
               }
           }
           $manager->flush();
       }
       }

}
