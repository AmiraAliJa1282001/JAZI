from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from menu.models import Product
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product_name",
            "unit_price",
            "quantity",
            "line_total",
            "image",
        ]

    def get_image(self, obj):
        if (
            obj.product
            and obj.product.image
        ):
            request = self.context.get("request")

            if request:
                return request.build_absolute_uri(
                    obj.product.image.url
                )

            return obj.product.image.url

        return None

class OrderCreateSerializer(serializers.Serializer):
    customer_name = serializers.CharField(
        max_length=120
    )

    phone = serializers.CharField(
        max_length=30
    )

    note = serializers.CharField(
        required=False,
        allow_blank=True,
        default="",
    )

    items = serializers.ListField(
        child=serializers.DictField(),
        allow_empty=False,
    )

    def validate_items(self, items):
        validated_items = []

        for item in items:
            product_id = item.get("product_id")
            quantity = item.get("quantity")

            if not product_id:
                raise serializers.ValidationError(
                    "Each item must include product_id."
                )

            try:
                quantity = int(quantity)
            except (TypeError, ValueError):
                raise serializers.ValidationError(
                    "Quantity must be a number."
                )

            if quantity < 1:
                raise serializers.ValidationError(
                    "Quantity must be at least 1."
                )

            try:
                product = Product.objects.get(
                    id=product_id,
                    is_active=True,
                )
            except Product.DoesNotExist:
                raise serializers.ValidationError(
                    f"Product {product_id} does not exist."
                )

            if not product.is_available:
                raise serializers.ValidationError(
                    f"{product.name} is currently unavailable."
                )

            validated_items.append({
                "product": product,
                "quantity": quantity,
            })

        return validated_items

    @transaction.atomic
    def create(self, validated_data):
        items = validated_data.pop("items")

        order = Order.objects.create(
            **validated_data
        )

        total = Decimal("0.00")

        for item in items:
            product = item["product"]
            quantity = item["quantity"]

            unit_price = product.price
            line_total = (
                unit_price * quantity
            )

            OrderItem.objects.create(
                order=order,
                product=product,
                product_name=product.name,
                unit_price=unit_price,
                quantity=quantity,
                line_total=line_total,
            )

            total += line_total

        order.total = total

        order.save(
            update_fields=["total"]
        )

        return order


class OrderDetailSerializer(
    serializers.ModelSerializer
):
    items = OrderItemSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Order

        fields = [
            "id",
            "order_number",
            "customer_name",
            "phone",
            "note",
            "status",
            "total",
            "items",
            "created_at",
            "updated_at",
        ]


class EmployeeOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(
        many=True,
        read_only=True,
    )

    status_display = serializers.CharField(
        source="get_status_display",
        read_only=True,
    )

    class Meta:
        model = Order

        fields = [
            "id",
            "order_number",
            "customer_name",
            "phone",
            "note",
            "status",
            "status_display",
            "total",
            "items",
            "created_at",
            "updated_at",
        ]


