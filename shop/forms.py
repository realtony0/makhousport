from django import forms

from .models import Order


class CheckoutForm(forms.Form):
    customer_name = forms.CharField(label="Nom complet", max_length=120)
    customer_phone = forms.CharField(label="Téléphone", max_length=40)
    customer_email = forms.EmailField(label="Email (optionnel)", required=False)
    address = forms.CharField(label="Adresse", max_length=255)
    city = forms.CharField(label="Ville", max_length=120, initial="Dakar")
    payment_method = forms.ChoiceField(
        label="Mode de paiement", choices=Order.PaymentMethod.choices, initial=Order.PaymentMethod.CASH
    )
    notes = forms.CharField(
        label="Notes (optionnel)",
        required=False,
        widget=forms.Textarea(attrs={"rows": 3}),
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        base = "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-slate-200 focus:ring"
        self.fields["customer_name"].widget.attrs.update({"class": base, "placeholder": "Ex: Makhou Ndiaye"})
        self.fields["customer_phone"].widget.attrs.update({"class": base, "placeholder": "Ex: +221 77 000 00 00"})
        self.fields["customer_email"].widget.attrs.update({"class": base, "placeholder": "Ex: nom@email.com"})
        self.fields["address"].widget.attrs.update({"class": base, "placeholder": "Quartier, rue, repère…"})
        self.fields["city"].widget.attrs.update({"class": base})
        self.fields["payment_method"].widget.attrs.update({"class": base})
        self.fields["notes"].widget.attrs.update({"class": base})
