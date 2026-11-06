from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)
    name_ar = models.CharField(max_length=100, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='products'
    )

    name = models.CharField(max_length=150)
    name_ar = models.CharField(max_length=150, blank=True)

    description = models.TextField(blank=True)
    description_ar = models.TextField(blank=True)

    price = models.DecimalField(
        max_digits=8,
        decimal_places=2
    )

    image = models.ImageField(
        upload_to='products/',
        blank=True,
        null=True
    )

    is_available = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    is_best_seller = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)

    display_order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name


