from __future__ import annotations

from .models import Category


def shop_context(request):
    cart = request.session.get("cart", {})
    cart_count = 0
    if isinstance(cart, dict):
        cart_count = sum(int(qty) for qty in cart.values() if str(qty).isdigit())

    return {
        "site_name": "Makhou Sport",
        "nav_categories": Category.objects.filter(is_active=True).order_by("name"),
        "cart_count": cart_count,
    }

