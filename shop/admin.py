from django.contrib import admin
from django.utils.html import format_html

from .models import Category, Order, OrderItem, Product, ProductImage


def format_xof(value: int) -> str:
    return f"{value:,}".replace(",", " ") + " FCFA"


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0
    fields = ("preview", "image", "alt_text", "sort_order")
    readonly_fields = ("preview",)

    def preview(self, obj: ProductImage):
        if not obj.pk or not obj.image:
            return "-"
        return format_html(
            '<img src="{}" style="height: 48px; width: 48px; object-fit: cover; border-radius: 6px;" />',
            obj.image.url,
        )

    preview.short_description = "Aperçu"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price_display", "stock", "is_active", "created_at")
    list_filter = ("category", "is_active")
    search_fields = ("name", "slug", "description")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline]

    def price_display(self, obj: Product) -> str:
        return format_xof(obj.price_xof)

    price_display.short_description = "Prix"


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    fields = ("product", "product_name", "quantity", "unit_price_xof", "line_total")
    readonly_fields = ("line_total",)

    def line_total(self, obj: OrderItem):
        return format_xof(obj.line_total_xof)

    line_total.short_description = "Total"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "status",
        "payment_method",
        "customer_name",
        "customer_phone",
        "total_display",
        "created_at",
    )
    list_filter = ("status", "payment_method", "created_at")
    search_fields = ("id", "customer_name", "customer_phone", "customer_email")
    inlines = [OrderItemInline]
    readonly_fields = ("created_at",)

    def total_display(self, obj: Order) -> str:
        return format_xof(obj.total_xof)

    total_display.short_description = "Total"


admin.site.site_header = "Makhou Sport — Administration"
admin.site.site_title = "Makhou Sport"
admin.site.index_title = "Gestion de la boutique"
