from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True, db_index=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)[:140]
        super().save(*args, **kwargs)


class Product(models.Model):
    category = models.ForeignKey(Category, related_name="products", on_delete=models.PROTECT)
    name = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True, db_index=True)
    description = models.TextField(blank=True)
    price_xof = models.PositiveIntegerField(help_text="Prix en FCFA (XOF)")
    compare_at_price_xof = models.PositiveIntegerField(
        blank=True, null=True, help_text="Ancien prix (optionnel) en FCFA (XOF)"
    )
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Produit"
        verbose_name_plural = "Produits"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)[:180]
        super().save(*args, **kwargs)

    @property
    def main_image(self):
        prefetched_images = getattr(self, "_prefetched_objects_cache", {}).get("images")
        if prefetched_images is not None:
            return prefetched_images[0] if prefetched_images else None
        return self.images.order_by("sort_order", "id").first()


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="products/")
    alt_text = models.CharField(max_length=180, blank=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "Image produit"
        verbose_name_plural = "Images produit"
        ordering = ["sort_order", "id"]

    def __str__(self) -> str:
        return f"{self.product.name} (#{self.sort_order})"


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "En attente"
        CONFIRMED = "confirmed", "Confirmée"
        PAID = "paid", "Payée"
        SHIPPED = "shipped", "Expédiée"
        COMPLETED = "completed", "Terminée"
        CANCELED = "canceled", "Annulée"

    class PaymentMethod(models.TextChoices):
        CASH = "cash", "Paiement à la livraison"
        ORANGE_MONEY = "orange_money", "Orange Money"
        WAVE = "wave", "Wave"

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    payment_method = models.CharField(
        max_length=20, choices=PaymentMethod.choices, default=PaymentMethod.CASH
    )
    customer_name = models.CharField(max_length=120)
    customer_phone = models.CharField(max_length=40)
    customer_email = models.EmailField(blank=True)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=120, default="Dakar")
    notes = models.TextField(blank=True)
    total_xof = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Commande"
        verbose_name_plural = "Commandes"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"Commande #{self.pk}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    product_name = models.CharField(max_length=160)
    quantity = models.PositiveIntegerField()
    unit_price_xof = models.PositiveIntegerField()

    class Meta:
        verbose_name = "Ligne de commande"
        verbose_name_plural = "Lignes de commande"

    def __str__(self) -> str:
        return f"{self.product_name} × {self.quantity}"

    @property
    def line_total_xof(self) -> int:
        return int(self.quantity) * int(self.unit_price_xof)
