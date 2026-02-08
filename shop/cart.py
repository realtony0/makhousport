from __future__ import annotations

from dataclasses import dataclass

from .models import Product


CART_SESSION_KEY = "cart"


@dataclass(frozen=True)
class CartLine:
    product: Product
    quantity: int
    line_total_xof: int


def _get_cart_dict(session) -> dict[str, int]:
    cart = session.get(CART_SESSION_KEY)
    if not isinstance(cart, dict):
        cart = {}
        session[CART_SESSION_KEY] = cart
    return cart


def add(session, product_id: int, quantity: int = 1) -> None:
    cart = _get_cart_dict(session)
    key = str(product_id)
    cart[key] = int(cart.get(key, 0)) + int(quantity)
    session.modified = True


def remove(session, product_id: int) -> None:
    cart = _get_cart_dict(session)
    key = str(product_id)
    if key in cart:
        del cart[key]
        session.modified = True


def set_quantity(session, product_id: int, quantity: int) -> None:
    cart = _get_cart_dict(session)
    key = str(product_id)
    quantity = int(quantity)
    if quantity <= 0:
        if key in cart:
            del cart[key]
            session.modified = True
        return

    cart[key] = quantity
    session.modified = True


def clear(session) -> None:
    session[CART_SESSION_KEY] = {}
    session.modified = True


def build_lines(cart_dict: dict[str, int]) -> tuple[list[CartLine], int]:
    product_ids: list[int] = []
    for key in cart_dict.keys():
        try:
            product_ids.append(int(key))
        except ValueError:
            continue

    products = Product.objects.filter(is_active=True, id__in=product_ids).prefetch_related("images")
    product_map = {p.id: p for p in products}

    lines: list[CartLine] = []
    total_xof = 0
    for key, qty in cart_dict.items():
        try:
            product_id = int(key)
            quantity = int(qty)
        except ValueError:
            continue

        if quantity <= 0:
            continue

        product = product_map.get(product_id)
        if not product:
            continue

        line_total = int(product.price_xof) * int(quantity)
        lines.append(CartLine(product=product, quantity=quantity, line_total_xof=line_total))
        total_xof += line_total

    return lines, total_xof

