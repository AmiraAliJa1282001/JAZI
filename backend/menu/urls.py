
from django.urls import path

from .views import (
    MenuListAPIView,
    BestSellerListAPIView,
    NewProductListAPIView,
    EmployeeProductListAPIView,
    EmployeeProductAvailabilityAPIView,
    AdminProductListCreateAPIView,
    AdminProductDetailAPIView,
    AdminCategoryListAPIView,
    AdminCategoryDetailAPIView,

)

urlpatterns = [
    path(
        "",
        MenuListAPIView.as_view(),
        name="menu-list",
    ),
    path(
        "best-sellers/",
        BestSellerListAPIView.as_view(),
        name="best-sellers",
    ),
    path(
        "new/",
        NewProductListAPIView.as_view(),
        name="new-products",
    ),
    path(
        "employee/products/",
        EmployeeProductListAPIView.as_view(),
        name="employee-product-list",
    ),
    path(
        "employee/products/<int:product_id>/availability/",
        EmployeeProductAvailabilityAPIView.as_view(),
        name="employee-product-availability",
    ),
    path(
        "admin/products/",
        AdminProductListCreateAPIView.as_view(),
        name="admin-product-list-create",
    ),
    path(
        "admin/products/<int:product_id>/",
        AdminProductDetailAPIView.as_view(),
        name="admin-product-detail",
    ),
    path("admin/categories/", AdminCategoryListAPIView.as_view(), name="admin-category-list"),
    
    path(
        "admin/categories/<int:category_id>/",
        AdminCategoryDetailAPIView.as_view(),
        name="admin-category-detail",
    ),

]
