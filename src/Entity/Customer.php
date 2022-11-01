<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\CustomerRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Component\Validator\Constraints as Assert;

// *    itemOperations={"GET","PUT","DELETE", "POST"},
/**
 * @ORM\Entity(repositoryClass=CustomerRepository::class)
 * @ApiResource(
 *    attributes={
 *       "pagination_enabled"=true,
 *       "pagination_items_per_page"=1000
 *    },
 *    collectionOperations={"GET", "POST"},

 *    subresourceOperations={
 *       "invoces_get_subresource"={"path"="/clients/{id}/factures"}
 *    },
 *    normalizationContext={
 *       "groups"={"customer_read"}
 *    }
 * )
 * @ApiFilter(SearchFilter::class, properties={"firstname":"partial","lastname","company"})
 * @ApiFilter(OrderFilter::class)
 */
class Customer
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"customer_read","invoces_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customer_read","invoces_read"})
     * @Assert\NotBlank(message="Le prénom de customer est obligatoire")
     * @Assert\Length(min=2, minMessage="Le nom de famille doit etre compris entre 3 et 255 caractères",
     *                max=255, maxMessage="Le prénom doit etre compris entre 3 et 255 caractères")
     */
    private $firstname;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customer_read","invoces_read"})
     * @Assert\NotBlank(message="Le prénom de customer est obligatoire")
     * @Assert\Length(min=2, minMessage="Le prénom doit etre compris entre 3 et 255 caractères",
     *                max=255, maxMessage="Le prénom doit etre compris entre 3 et 255 caractères")
     */
    private $lastname;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customer_read","invoces_read"})
     * @Assert\NotBlank(message="L'email' de customer est obligatoire")
     * @Assert\Email(message="Veuillez entrer un email valide SVP")
    
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"customer_read","invoces_read"})
     */
    private $company;

    /**
     * @ORM\OneToMany(targetEntity=Invoice::class, mappedBy="customer")
     * @Groups({"customer_read"})
     * @ApiSubresource
     */
    private $invoices;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="customer")
     * @Groups({"customer_read","invoces_read"})
     * Assert\NotBlank(message="le user est obligatoire")
     */
    private $user;

    public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): self
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection|Invoice[]
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setCustomer($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->removeElement($invoice)) {
            // set the owning side to null (unless already changed)
            if ($invoice->getCustomer() === $this) {
                $invoice->setCustomer(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
    /**
     * @Groups({"customer_read"})
     * @return void
     */
    public function getAmountTotal(){
       return array_reduce($this->invoices->toArray(),function($total,$invoce){
         
            return $total + $invoce->getAmount();
       },0) ;
    }
   /**
     * @Groups({"customer_read"})
     * @return void
     */
    public function getUnpaidAmount(){
         return array_reduce($this->invoices->toArray(),function($total,$invoce){
         
            return $total + ($invoce->getStatus() =='PAID' || $invoce->getStatus() == 'CANCELLED'? 0 : $invoce->getAmount()) ;
       },0) ; 
    }
}
