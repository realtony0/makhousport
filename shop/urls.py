from django.urls import path

from . import views

app_name = "shop"

urlpatterns = [
    path("", views.home, name="home"),
    path("boutique/", views.product_list, name="product_list"),
    path("categorie/<slug:category_slug>/", views.product_list, name="product_list_by_category"),
    path("produit/<slug:slug>/", views.product_detail, name="product_detail"),
    path("panier/", views.cart_detail, name="cart_detail"),
    path("panier/ajouter/<int:product_id>/", views.cart_add, name="cart_add"),
    path("panier/supprimer/<int:product_id>/", views.cart_remove, name="cart_remove"),
    path("commande/", views.checkout, name="checkout"),
    path("commande/<int:order_id>/merci/", views.checkout_success, name="checkout_success"),
]

