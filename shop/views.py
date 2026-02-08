from __future__ import annotations

from django.contrib import messages
from django.core.paginator import Paginator
from django.db import transaction
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse

from . import cart
from .forms import CheckoutForm
from .models import Category, Order, OrderItem, Product


def home(request: HttpRequest) -> HttpResponse:
    featured_products = (
        Product.objects.filter(is_active=True).prefetch_related("images").select_related("category")[:8]
    )
    categories = Category.objects.filter(is_active=True).order_by("name")[:8]
    return render(
        request,
        "shop/home.html",
        {
            "featured_products": featured_products,
            "categories": categories,
        },
    )


def product_list(request: HttpRequest, category_slug: str | None = None) -> HttpResponse:
    products = Product.objects.filter(is_active=True).select_related("category").prefetch_related("images")
    category = None
    if category_slug:
        category = get_object_or_404(Category, slug=category_slug, is_active=True)
        products = products.filter(category=category)

    q = (request.GET.get("q") or "").strip()
    if q:
        products = products.filter(name__icontains=q)

    tri = request.GET.get("tri") or "recent"
    if tri == "prix_asc":
        products = products.order_by("price_xof", "-created_at")
    elif tri == "prix_desc":
        products = products.order_by("-price_xof", "-created_at")
    elif tri == "nom":
        products = products.order_by("name")
    else:
        products = products.order_by("-created_at")

    paginator = Paginator(products, 12)
    page_obj = paginator.get_page(request.GET.get("page"))

    return render(
        request,
        "shop/product_list.html",
        {
            "category": category,
            "q": q,
            "tri": tri,
            "page_obj": page_obj,
        },
    )


def product_detail(request: HttpRequest, slug: str) -> HttpResponse:
    product = get_object_or_404(
        Product.objects.filter(is_active=True).prefetch_related("images").select_related("category"),
        slug=slug,
    )

    return render(request, "shop/product_detail.html", {"product": product})


def cart_add(request: HttpRequest, product_id: int):
    if request.method != "POST":
        return redirect("shop:cart_detail")

    product = get_object_or_404(Product, pk=product_id, is_active=True)
    try:
        quantity = int(request.POST.get("quantity") or 1)
    except ValueError:
        quantity = 1

    quantity = max(1, quantity)
    if product.stock <= 0:
        messages.error(request, "Produit en rupture de stock.")
        return redirect("shop:product_detail", slug=product.slug)

    if quantity > product.stock:
        quantity = product.stock
        messages.info(request, "Quantité ajustée selon le stock disponible.")

    cart.add(request.session, product_id=product.id, quantity=quantity)
    messages.success(request, "Produit ajouté au panier.")
    return redirect("shop:cart_detail")


def cart_remove(request: HttpRequest, product_id: int):
    if request.method != "POST":
        return redirect("shop:cart_detail")

    cart.remove(request.session, product_id=product_id)
    messages.info(request, "Produit supprimé du panier.")
    return redirect("shop:cart_detail")


def cart_detail(request: HttpRequest) -> HttpResponse:
    cart_dict = request.session.get(cart.CART_SESSION_KEY, {})
    if not isinstance(cart_dict, dict):
        cart_dict = {}

    if request.method == "POST":
        remove_id = request.POST.get("remove_id")
        if remove_id:
            try:
                product_id = int(remove_id)
            except ValueError:
                product_id = None

            if product_id is not None:
                cart.remove(request.session, product_id=product_id)
                messages.info(request, "Produit supprimé du panier.")
                return redirect("shop:cart_detail")

        for key in list(cart_dict.keys()):
            try:
                product_id = int(key)
            except ValueError:
                continue

            field_name = f"qty_{product_id}"
            if field_name not in request.POST:
                continue

            try:
                quantity = int(request.POST.get(field_name) or 0)
            except ValueError:
                quantity = 0

            cart.set_quantity(request.session, product_id=product_id, quantity=quantity)

        messages.success(request, "Panier mis à jour.")
        return redirect("shop:cart_detail")

    lines, total_xof = cart.build_lines(cart_dict)
    return render(
        request,
        "shop/cart_detail.html",
        {
            "lines": lines,
            "total_xof": total_xof,
        },
    )


def checkout(request: HttpRequest) -> HttpResponse:
    cart_dict = request.session.get(cart.CART_SESSION_KEY, {})
    if not isinstance(cart_dict, dict) or not cart_dict:
        messages.info(request, "Votre panier est vide.")
        return redirect("shop:product_list")

    lines, total_xof = cart.build_lines(cart_dict)
    if not lines:
        messages.info(request, "Votre panier est vide.")
        cart.clear(request.session)
        return redirect("shop:product_list")

    if request.method == "POST":
        form = CheckoutForm(request.POST)
        if form.is_valid():
            with transaction.atomic():
                # Vérification stock
                for line in lines:
                    if line.product.stock < line.quantity:
                        messages.error(
                            request,
                            f"Stock insuffisant pour “{line.product.name}”. Ajustez votre panier.",
                        )
                        return redirect("shop:cart_detail")

                order = Order.objects.create(
                    status=Order.Status.PENDING,
                    payment_method=form.cleaned_data["payment_method"],
                    customer_name=form.cleaned_data["customer_name"],
                    customer_phone=form.cleaned_data["customer_phone"],
                    customer_email=form.cleaned_data["customer_email"],
                    address=form.cleaned_data["address"],
                    city=form.cleaned_data["city"],
                    notes=form.cleaned_data["notes"],
                    total_xof=total_xof,
                )

                items = []
                for line in lines:
                    items.append(
                        OrderItem(
                            order=order,
                            product=line.product,
                            product_name=line.product.name,
                            quantity=line.quantity,
                            unit_price_xof=line.product.price_xof,
                        )
                    )
                    line.product.stock = max(0, line.product.stock - line.quantity)
                    line.product.save(update_fields=["stock"])

                OrderItem.objects.bulk_create(items)

            cart.clear(request.session)
            request.session["last_order_id"] = order.id
            messages.success(request, "Commande créée avec succès.")
            return redirect("shop:checkout_success", order_id=order.id)
    else:
        form = CheckoutForm()

    return render(
        request,
        "shop/checkout.html",
        {
            "form": form,
            "lines": lines,
            "total_xof": total_xof,
        },
    )


def checkout_success(request: HttpRequest, order_id: int) -> HttpResponse:
    last_order_id = request.session.get("last_order_id")
    if last_order_id != order_id:
        return redirect("shop:home")

    order = get_object_or_404(Order.objects.prefetch_related("items"), pk=order_id)
    return render(request, "shop/checkout_success.html", {"order": order})
