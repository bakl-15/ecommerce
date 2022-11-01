<?php

namespace App\Entity;

use App\Entity\Customer;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 * @ApiResource(
 *   normalizationContext={"groups"={"users_read"}},
 *   collectionOperations={"GET",
 *                   "POST",
 *                
 *                   "CONECTED"={"method"="GET",
 *                               "path"="/user/connected",
 *                               "controller"="App\Controller\ConnectedUserController",
 *                                                      "swagger_context"={
 *                                                              "summary"="L'utilisateur connecté",
 *                                                              "description"="Rencoie l'utilisateur connecté"
 *                                                              }
 *                                                       }},
 * )
 * @UniqueEntity("email", message="l'email est déja utilisé")
 */
class User implements UserInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"invoces_read","customer_read","invoices_subresource","users_read","expense_read"})
     */
    private $id;

    /**
     * @Assert\Length(min=5, minMessage="Le prenom de famille doit etre compris entre 3 et 255 caractères",
     *                max=255, maxMessage="Le prénom doit etre compris entre 3 et 255 caractères")
     * @ORM\Column(type="string", length=180, unique=true)
     * @Groups({"invoces_read","customer_read","invoices_subresource","users_read","expense_read"})
     */
    private $email;

    /**
     * @ORM\Column(type="json")
     */
    private $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoces_read","customer_read","invoices_subresource","users_read","expense_read"})
     * @Assert\NotBlank(message="Le prénom de customer est obligatoire")
     * @Assert\Length(min=5, minMessage="Le prenom de famille doit etre compris entre 3 et 255 caractères",
     *                max=255, maxMessage="Le prénom doit etre compris entre 3 et 255 caractères")
     */
    private $firstname;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoces_read","customer_read","invoices_subresource","users_read","expense_read"})
     * @Assert\NotBlank(message="Le prénom de customer est obligatoire")
     * @Assert\Length(min=5, minMessage="Le nom de famille doit etre compris entre 3 et 255 caractères",
     *                max=255, maxMessage="Le nom doit etre compris entre 3 et 255 caractères")
     */
    private $lastname;

    /**
     * @ORM\OneToMany(targetEntity=Customer::class, mappedBy="user")
     */
    private $customer;

    /**
     * @ORM\OneToMany(targetEntity=Expense::class, mappedBy="user")
     */
    private $expenses;

    public function __construct()
    {
        $this->customer = new ArrayCollection();
        $this->expenses = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Returning a salt is only needed, if you are not using a modern
     * hashing algorithm (e.g. bcrypt or sodium) in your security.yaml.
     *
     * @see UserInterface
     */
    public function getSalt(): ?string
    {
        return null;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getLastname(): ?string
    {
        return $this->lastname;
    }

    public function setLastname(string $lastname): self
    {
        $this->lastname = $lastname;

        return $this;
    }

    /**
     * @return Collection|Customer[]
     */
    public function getCustomer(): Collection
    {
        return $this->customer;
    }

    public function addCustomer(Customer $customer): self
    {
        if (!$this->customer->contains($customer)) {
            $this->customer[] = $customer;
            $customer->setUser($this);
        }

        return $this;
    }

    public function removeCustomer(Customer $customer): self
    {
        if ($this->customer->removeElement($customer)) {
            // set the owning side to null (unless already changed)
            if ($customer->getUser() === $this) {
                $customer->setUser(null);
            }
        }

        return $this;
    }
public function getUserIdentifier()
{
    return (string) $this->email;
}

/**
 * @return Collection|Expense[]
 */
public function getExpenses(): Collection
{
    return $this->expenses;
}

public function addExpense(Expense $expense): self
{
    if (!$this->expenses->contains($expense)) {
        $this->expenses[] = $expense;
        $expense->setUser($this);
    }
    return $this;
}

public function removeExpense(Expense $expense): self
{
    if ($this->expenses->removeElement($expense)) {
        // set the owning side to null (unless already changed)
        if ($expense->getUser() === $this) {
            $expense->setUser(null);
        }
    }

    return $this;
}
/**
   * @Groups({"invoces_read","customer_read","invoices_subresource","users_read","expense_read"})
   */
  public function getExpenseCount(){
     return count($this->expenses->toArray());
  }
  /**
   * @Groups({"invoces_read","customer_read","invoices_subresource","users_read","expense_read"})
   */
  public function getCustomerCount(){
    return count($this->customer);
  }
/**
   * @Groups({"invoces_read","customer_read","invoices_subresource","users_read","expense_read"})
   */
  public function getInvoiceCount(){
    $invoices = [];
    foreach($this->customer as $c){
      $invoices=    array_merge($invoices, $c->getInvoices()->toArray());
    }
    return count($invoices);
  }

  /**
   * @Groups({"invoces_read","customer_read","invoices_subresource","users_read","expense_read"})
   */
   public function getAmountTotalInvoice(){

      $invoices = [];
      foreach($this->customer as $c){
        $invoices=    array_merge($invoices, $c->getInvoices()->toArray());
      }
     return  array_reduce($invoices,function($total,$item){
       
      $total = round( $total + $item->getAmount(),0);
      return $total;
      });
   }

   /**
   * @Groups({"invoces_read","customer_read","invoices_subresource","users_read","expense_read"})
   */
   public function getAmountTotalInvoicePaid(){

    $invoices = [];
    foreach($this->customer as $c){
       
          $invoices=    array_merge($invoices, $c->getInvoices()->toArray());
          
    }
    return array_reduce($invoices,function($total,$item){
        if($item->getStatus() === "paid"){
             $total =round($total + $item->getAmount(),0) ;
        }
   
    return $total;
    });
    
 }

 /**
   * @Groups({"invoces_read","customer_read","invoices_subresource","users_read","expense_read"})
   */
 public function getAmountTotalInvoiceNotPaid(){

    $invoices = [];
    foreach($this->customer as $c){
      
            $invoices=    array_merge($invoices, $c->getInvoices()->toArray());
         
    }
   return array_reduce($invoices,function($total,$item){
     
       
    if($item->getStatus() !== "paid"){
        $total = round($total + $item->getAmount(),0) ;
     }
        
    return $total;
    });
}

/**
   * @Groups({"invoces_read","customer_read","invoices_subresource","users_read","expense_read"})
   */
  public function getAmountTvaInvoice(){

    $invoices = [];
    foreach($this->customer as $c){
      
            $invoices= array_merge($invoices, $c->getInvoices()->toArray());
         
    }
   return array_reduce($invoices,function($total,$item){
     
       
        $total = round( ($item->getTva()/100) * $item->getAmount(),0);

        
    return $total;
    });
}


/**
   * @Groups({"invoces_read","customer_read","invoices_subresource","users_read","expense_read"})
   */
public function getExpenseAmount(){

    return array_reduce($this->expenses->toArray(),function($total,$item){
     
       

            $total = round($total + $item->getAmount(),0);
  
            
        return $total;
        });
}

/**
   * @Groups({"invoces_read","customer_read","invoices_subresource","users_read","expense_read"})
   */
  public function getExpenseTva(){
    return array_reduce($this->expenses->toArray(),function($total,$item){
            $total = round( $total + (($item->getTva()/100) * $item->getPrice())) ;   
        return $total;
        });
}

/**
   * @Groups({"invoces_read","customer_read","invoices_subresource","users_read","expense_read"})
   */
  public function getTva(){
    return $this->getAmountTvaInvoice() - $this->getExpenseTva();
  }
   /**
   * @Groups({"invoces_read","customer_read","invoices_subresource","users_read","expense_read"})
   */
  public function getDataGraphTotal(){
    $data = [];
    $invoices = [];
    foreach($this->customer as $c){
       
          $invoices=    array_merge($invoices, $c->getInvoices()->toArray());
          
    }
      foreach($invoices as $invoice){
        $data[$invoice->getPaimentDate()->format('Y/m/d')] = round($invoice->getAmountTotal(),0) ;
      }
    return $data;
 }

  /**
   * @Groups({"invoces_read","customer_read","invoices_subresource","users_read","expense_read"})
   */
  public function getDataGraphPaid(){
    $data = [];
    $invoices = [];
    foreach($this->customer as $c){
       
          $invoices=    array_merge($invoices, $c->getInvoices()->toArray());
          
    }
      foreach($invoices as $invoice){
        if($invoice->getStatus() === "paid"){
            $data[$invoice->getPaimentDate()->format('Y/m/d')] = round($invoice->getAmountTotal(),0);
        }
       
      }
    return $data;
 }

  /**
   * @Groups({"invoces_read","customer_read","invoices_subresource","users_read","expense_read"})
   */
  public function getDataGraphNotPaid(){
    $data = [];
    $invoices = [];
    foreach($this->customer as $c){
          $invoices = array_merge($invoices, $c->getInvoices()->toArray());  
    }
      foreach($invoices as $invoice){
        if($invoice->getStatus() !== "paid"){
            $data[$invoice->getPaimentDate()->format('Y/m/d')] = round($invoice->getAmountTotal(),0) ;
        }
       
      }
    return $data;
 }
}