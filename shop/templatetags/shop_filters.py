from django import template

register = template.Library()


@register.filter
def xof(value):
    try:
        value_int = int(value)
    except (TypeError, ValueError):
        return value

    return f"{value_int:,}".replace(",", " ") + " FCFA"

