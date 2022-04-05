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
 *    "pagination_enabled"=true,
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
     * @ORM\Column(type="float")
     * @Groups({"invoces_read","customer_read","invoices_subresource"})
     * @Assert\NotBlank(message="Le montant de la facture est obligatoire")
     * @Assert\Type(type="numeric", message="Le montant de la facture doit etre un chiffre")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoces_read","customer_read","invoices_subresource"})
     * @Assert\NotBlank(message="La date de la facture est obligatoire")
     * @Assert\DateTime(message="La date doit etre au format yyyy-mm-dd")
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoces_read","customer_read","invoices_subresource"})
     * @Assert\NotBlank(message="Le status  de la facture est obligatoire")
     * @Assert\Choice(choices={"SENT","CANCELED","PAID"}, message="le status doit etre SENT PAID CANCELED")
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
}
