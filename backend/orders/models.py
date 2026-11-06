import random

from django.db import models

from menu.models import Product


def generate_order_number():
    return f"JZ-{random.randint(100000, 999999)}"


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        PREPARING = "preparing", "Preparing"
        READY = "ready", "Ready"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    order_number = models.CharField(
        max_length=9,
        unique=True,
        editable=False,
        default=generate_order_number,
    )

    customer_name = models.CharField(
        max_length=120
    )

    phone = models.CharField(
        max_length=30
    )

    note = models.TextField(
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return (
            f"{self.order_number} - "
            f"{self.customer_name}"
        )


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="order_items",
    )

    product_name = models.CharField(
        max_length=150
    )

    unit_price = models.DecimalField(
        max_digits=8,
        decimal_places=2
    )

    quantity = models.PositiveIntegerField()

    line_total = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    def __str__(self):
        return (
            f"{self.product_name} "
            f"x {self.quantity}"
        )