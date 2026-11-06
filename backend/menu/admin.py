from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'name_ar',
        'display_order',
        'is_active',
    )

    list_editable = (
        'display_order',
        'is_active',
    )

    search_fields = (
        'name',
        'name_ar',
    )

    ordering = (
        'display_order',
        'name',
    )


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'category',
        'price',
        'is_available',
        'is_active',
        'is_best_seller',
        'is_new',
    )

    list_filter = (
        'category',
        'is_available',
        'is_active',
        'is_best_seller',
        'is_new',
    )

    list_editable = (
        'price',
        'is_available',
        'is_active',
        'is_best_seller',
        'is_new',
    )

    search_fields = (
        'name',
        'name_ar',
    )

    ordering = (
        'category',
        'display_order',
        'name',
    )