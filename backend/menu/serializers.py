from rest_framework import serializers
from .models import Category, Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'name_ar',
            'description',
            'description_ar',
            'price',
            'image',
            'is_available',
            'is_best_seller',
            'is_new',
        ]


class CategorySerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'name_ar',
            'products',
        ]

    def get_products(self, obj):
        products = obj.products.filter(is_active=True)
        return ProductSerializer(
            products,
            many=True,
            context=self.context
        ).data


from rest_framework import serializers
from .models import Product


class EmployeeProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True,
    )

    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "category",
            "category_name",
            "price",
            "image",
            "image_url",
            "is_available",
            "is_active",
        ]

        read_only_fields = [
            "id",
            "name",
            "category",
            "category_name",
            "price",
            "image",
            "image_url",
            "is_active",
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(
                obj.image.url
            )





class AdminProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "category_name",
            "name",
            "name_ar",
            "description",
            "description_ar",
            "price",
            "image",
            "image_url",
            "is_available",
            "is_active",
            "is_best_seller",
            "is_new",
            "display_order",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "category_name",
            "image_url",
            "created_at",
            "updated_at",
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(
                obj.image.url
            )

        return obj.image.url

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Price cannot be negative."
            )

        return value



class AdminCategorySerializer(serializers.ModelSerializer):
    products_count = serializers.IntegerField(
        source="products.count",
        read_only=True,
    )

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "name_ar",
            "display_order",
            "is_active",
            "products_count",
        ]
        read_only_fields = [
            "id",
            "products_count",
        ]

    def validate_name(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Category name is required."
            )

        return value
