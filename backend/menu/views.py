from rest_framework.generics import ListAPIView

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer,EmployeeProductSerializer

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsEmployee


from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.pagination import PageNumberPagination

from accounts.permissions import IsAdmin
from .serializers import AdminProductSerializer

from .serializers import AdminCategorySerializer

from django.db.models.deletion import ProtectedError





class MenuListAPIView(ListAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return (
            Category.objects
            .filter(is_active=True)
            .prefetch_related('products')
        )


class BestSellerListAPIView(ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return (
            Product.objects
            .filter(
                is_active=True,
                is_available=True,
                is_best_seller=True
            )
            .order_by('display_order', 'name')
        )

class NewProductListAPIView(ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return (
            Product.objects
            .filter(
                is_active=True,
                is_available=True,
                is_new=True
            )
            .order_by('display_order', 'name')
        )

class EmployeeProductListAPIView(APIView):
    permission_classes = [IsEmployee]

    def get(self, request):
        products = (
            Product.objects
            .select_related("category")
            .filter(is_active=True)
            .order_by("category__name", "name")
        )

        serializer = EmployeeProductSerializer(
            products,
            many=True,
            context={
                "request": request,
            },
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class EmployeeProductAvailabilityAPIView(APIView):
    permission_classes = [IsEmployee]

    def patch(self, request, product_id):
        try:
            product = (
                Product.objects
                .select_related("category")
                .get(
                    id=product_id,
                    is_active=True,
                )
            )

        except Product.DoesNotExist:
            return Response(
                {
                    "detail": "Product not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if "is_available" not in request.data:
            return Response(
                {
                    "detail": (
                        "is_available is required."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        is_available = request.data.get(
            "is_available"
        )

        if not isinstance(
            is_available,
            bool,
        ):
            return Response(
                {
                    "detail": (
                        "is_available must be "
                        "true or false."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        product.is_available = is_available

        product.save(
            update_fields=[
                "is_available",
            ]
        )

        serializer = EmployeeProductSerializer(
            product,
            context={
                "request": request,
            },
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )



class AdminProductPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class AdminProductListCreateAPIView(APIView):
    permission_classes = [IsAdmin]
    parser_classes = [
        JSONParser,
        MultiPartParser,
        FormParser,
    ]

    def get(self, request):
        products = (
            Product.objects
            .select_related("category")
            .all()
            .order_by("display_order", "name", "id")
        )

        search = request.query_params.get(
            "search", ""
        ).strip()

        category_id = request.query_params.get(
            "category", ""
        ).strip()

        active = request.query_params.get(
            "is_active", ""
        ).strip().lower()

        available = request.query_params.get(
            "is_available", ""
        ).strip().lower()

        if search:
            products = products.filter(
                Q(name__icontains=search)
                | Q(name_ar__icontains=search)
                | Q(category__name__icontains=search)
            )

        if category_id:
            if not category_id.isdigit():
                return Response(
                    {"detail": "Invalid category ID."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            products = products.filter(
                category_id=int(category_id)
            )

        if active in ("true", "false"):
            products = products.filter(
                is_active=(active == "true")
            )
        elif active:
            return Response(
                {"detail": "Invalid is_active filter."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if available in ("true", "false"):
            products = products.filter(
                is_available=(available == "true")
            )
        elif available:
            return Response(
                {"detail": "Invalid is_available filter."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        paginator = AdminProductPagination()
        page = paginator.paginate_queryset(
            products,
            request,
            view=self,
        )

        serializer = AdminProductSerializer(
            page,
            many=True,
            context={"request": request},
        )

        return paginator.get_paginated_response(
            serializer.data
        )

    def post(self, request):
        serializer = AdminProductSerializer(
            data=request.data,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        return Response(
            AdminProductSerializer(
                product,
                context={"request": request},
            ).data,
            status=status.HTTP_201_CREATED,
        )


class AdminProductDetailAPIView(APIView):
    permission_classes = [IsAdmin]
    parser_classes = [
        JSONParser,
        MultiPartParser,
        FormParser,
    ]

    def get_object(self, product_id):
        return get_object_or_404(
            Product.objects.select_related("category"),
            pk=product_id,
        )

    def get(self, request, product_id):
        product = self.get_object(product_id)

        serializer = AdminProductSerializer(
            product,
            context={"request": request},
        )

        return Response(serializer.data)

    def patch(self, request, product_id):
        product = self.get_object(product_id)

        serializer = AdminProductSerializer(
            product,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        return Response(
            AdminProductSerializer(
                product,
                context={"request": request},
            ).data,
            status=status.HTTP_200_OK,
        )




class AdminCategoryListAPIView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        categories = (
            Category.objects
            .all()
            .order_by("display_order", "name", "id")
        )

        serializer = AdminCategorySerializer(
            categories,
            many=True,
        )

        return Response(serializer.data)

    def post(self, request):
        serializer = AdminCategorySerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)
        category = serializer.save()

        return Response(
            AdminCategorySerializer(category).data,
            status=status.HTTP_201_CREATED,
        )


class AdminCategoryDetailAPIView(APIView):
    permission_classes = [IsAdmin]

    def get_object(self, category_id):
        return get_object_or_404(
            Category,
            pk=category_id,
        )

    def get(self, request, category_id):
        category = self.get_object(category_id)

        serializer = AdminCategorySerializer(
            category
        )

        return Response(serializer.data)

    def patch(self, request, category_id):
        category = self.get_object(category_id)

        serializer = AdminCategorySerializer(
            category,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)
        category = serializer.save()

        return Response(
            AdminCategorySerializer(category).data,
            status=status.HTTP_200_OK,
        )
    def delete(self, request, category_id):
        category = get_object_or_404(Category, id=category_id)

        try:
            category.delete()
        except ProtectedError:
            return Response(
                {
                    "detail": (
                        "This category contains products. "
                        "Move or remove its products before deleting it."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(status=status.HTTP_204_NO_CONTENT)