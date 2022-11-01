<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\ExpenseRepository;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\HasLifecycleCallbacks()
 * @ApiResource()
 * @ORM\Entity(repositoryClass=ExpenseRepository::class)
 *  attributes={
 *    "pagination_enabled"=false,
 *    "pagination_items_per_page"=20,
 *    "order"={"amount": "desc"}
 *    },
 *   normalizationContext={
 *     "groups"={"expense_read"}
 *   } ,
 */
class Expense
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"expense_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"expense_read"})
     */
    private $price;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"expense_read"})
     */
    private $caption;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     * @Groups({"expense_read"})
     */
    private $isTva;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"expense_read"})
     */
    private $tva;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"expense_read"})
     */
    private $type;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="expenses")
     * @Groups({"expense_read"})
     */
    private $user;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $datePayment;

    /**
     * @ORM\Column(type="float")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     */
    private $purchaseDate;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $file;

    /**
     * @ORM\Column(type="integer", nullable=true)
     *  @Groups({"expense_read"})
     */
    private $month;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getCaption(): ?string
    {
        return $this->caption;
    }

    public function setCaption(string $caption): self
    {
        $this->caption = $caption;

        return $this;
    }

    public function getIsTva(): ?bool
    {
        return $this->isTva;
    }

    public function setIsTva(?bool $isTva): self
    {
        $this->isTva = $isTva;

        return $this;
    }

    public function getTva(): ?int
    {
        return $this->tva;
    }

    public function setTva(?int $tva): self
    {
        $this->tva = $tva;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

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

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getDatePayment(): ?\DateTimeInterface
    {
        return $this->datePayment;
    }

    public function setDatePayment(?\DateTimeInterface $datePayment): self
    {
        $this->datePayment = $datePayment;

        return $this;
    }

/**
 * @ORM\PrePersist
 */
public function setCreatedAtValue()
{
    $this->createdAt = new \DateTime();
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

/**
 * @ORM\PrePersist
 * @ORM\PreUpdate
 */
public function setAmountValue()
{
    if($this->tva > 0){
        $this->isTva = true;
        $this->amount = round($this->price + (($this->tva /100) * $this->price),2) ;
    }else{
       $this->isTva = false;
       $this->amount = round($this->price,2) ;
    }

}

public function getPurchaseDate(): ?\DateTimeInterface
{
    return $this->purchaseDate;
}

public function setPurchaseDate(\DateTimeInterface $purchaseDate): self
{
    $this->purchaseDate = $purchaseDate;

    return $this;
}


/**
 * @ORM\PrePersist
 * @ORM\PreUpdate
 */
public function setPurchaseDateValue()
{
   if(!$this->purchaseDate){
    $this->purchaseDate = new \DateTime();
   }

}

/**
 * @Groups({"expense_read"})
*/
public function getTvaAmount(){
    return round($this->price * ( $this->tva/100),2);
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

public function getMonth(): ?int
{
    return $this->month;
}

public function setMonth(?int $month): self
{
    $this->month = $month;

    return $this;
}

}
