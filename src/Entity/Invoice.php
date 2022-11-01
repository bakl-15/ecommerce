<?php

namespace App\Entity;

use App\Entity\Customer;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\InvoiceRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Validator\Constraints\Type;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints\NotBlank;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use Symfony\Component\Validator\Constraints as Assert;
/**
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 * @ORM\HasLifecycleCallbacks()
 * @ApiResource(
 *   subresourceOperations={
 *     "api_custumers_invoces_get_subresource"={
 *         "normalization_context" = {"groups"={"invoices_subresource"}}
 *      }
 *   },
 *   itemOperations={"GET","PUT","DELETE","INCREMENT"={"method"="POST",
 *                                                     "path"="/invoices/{id}/increment",
 *                                                      "controller"="App\Controller\IncrementInvoiceController",
 *                                                      "swagger_context"={
 *                                                              "summary"="Incremente  une facture",
 *                                                              "description"="Incremente le chrono d'une facture"
 *                                                              }
 *                                                       }},
 *   attributes={
 *    "pagination_enabled"=false,
 *    "pagination_items_per_page"=20,
 *    "order"={"amount": "desc"}
 *    },
 *   normalizationContext={
 *     "groups"={"invoces_read"}
 *   } ,
 * 
 *  )
 * @ApiFilter(OrderFilter::class, properties={"amount", "sentAt"})
 * 
 */
  // denormalizationContext=({"disable_type_enforcement"=true})
class Invoice
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"invoces_read","customer_read","invoices_subresource"})
     */
    private $id;

    /**
     * @Groups({"invoces_read","customer_read","invoices_subresource"})
     * @Assert\NotBlank(message="Le montant de la facture est obligatoire")
     * @Assert\Type(type="numeric", message="Le montant de la facture doit etre un chiffre")
     * @ORM\Column(type="float")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoces_read","customer_read","invoices_subresource"})
     * @Assert\NotBlank(message="La date de la facture est obligatoire")

     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoces_read","customer_read","invoices_subresource"})
     * @Assert\NotBlank(message="Le status  de la facture est obligatoire")
     * @Assert\Choice(choices={"sent","canceled","paid"}, message="le status doit etre SENT PAID CANCELED")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity=Customer::class, inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoces_read"})
     * @Assert\NotBlank(message="Le CUSTOMER  de la facture est obligatoire")
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoces_read","customer_read"})
     * @Assert\NotBlank(message="Le chrono  de la facture est obligatoire")
     * @Assert\Type(type="integer", message="Le chrono de la facture doit etre un chiffre")
     */
    private $chrono;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoces_read","customer_read"})
     */
    private $tva;

    /**
     *@Groups({"invoces_read","customer_read"})
     * @ORM\Column(type="float", nullable=true)
     */
    private $amountTotal;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"invoces_read","customer_read"})
     */
    private $paimentDate;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"invoces_read","customer_read"})
     */
    private $file;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt(\DateTimeInterface $sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono(int $chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
     /**
     * @Groups({"invoces_read"})
     */
    public function getUser():User{
        return $this->customer->getUser();
    }

    public function getTva(): ?float
    {
        return $this->tva;
    }

    public function setTva(float $tva): self
    {
        $this->tva = $tva;

        return $this;
    }

    public function getAmountTotal(): ?float
    {
        return $this->amountTotal;
    }

    public function setAmountTotal(?float $amountTotal): self
    {
        $this->amountTotal = $amountTotal;

        return $this;
    }
 /**
 * @ORM\PrePersist
 * @ORM\PreUpdate
 */
public function setAmountTotalValue()
{
    if($this->tva > 0){
   
        $this->amountTotal = $this->amount + (($this->tva /100) * $this->amount);
    }else{
       $this->isTva = false;
       $this->amountTotal =  $this->amount;
    }

}
 /**
 * @ORM\PrePersist
 * @ORM\PreUpdate
 */
public function setTvaValue()
{
    if(!$this->tva){
   
        $this->tva = 0;
    }

}

public function getPaimentDate(): ?\DateTimeInterface
{
    return $this->paimentDate;
}

public function setPaimentDate(?\DateTimeInterface $paimentDate): self
{
    $this->paimentDate = $paimentDate;

    return $this;
}

public function getFile(): ?string
{
    return $this->file;
}

public function setFile(?string $file): self
{
    $this->file = $file;

    return $this;
}

/**
 * @Groups({"invoces_read","customer_read"})
 */
public function getTvaAmount(){
    return round($this->amount * $this->tva);
}
}
