from __future__ import annotations

from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand

from shop.models import Category, Product, ProductImage


class Command(BaseCommand):
    help = "Crée des catégories/produits de démo (Makhou Sport) et attache les images du dossier media/products."

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING("Seeding Makhou Sport…"))

        media_products_dir = Path(settings.MEDIA_ROOT) / "products"
        if not media_products_dir.exists():
            self.stdout.write(
                self.style.WARNING(
                    f"Dossier introuvable: {media_products_dir}. Créez-le et ajoutez les images."
                )
            )

        categories_data = [
            {
                "slug": "chaussettes",
                "name": "Chaussettes",
                "description": "Chaussettes de sport pour l'entraînement et le match.",
            },
            {
                "slug": "vetements-compression",
                "name": "Vêtements de compression",
                "description": "Shorts, collants et tenues de compression.",
            },
            {
                "slug": "protection-maintien",
                "name": "Protection & maintien",
                "description": "Chevillères, sangles, manchons et accessoires de protection.",
            },
        ]

        categories: dict[str, Category] = {}
        for data in categories_data:
            cat, _ = Category.objects.update_or_create(
                slug=data["slug"],
                defaults={
                    "name": data["name"],
                    "description": data["description"],
                    "is_active": True,
                },
            )
            categories[data["slug"]] = cat

        products_data = [
            {
                "slug": "chaussettes-pack-multicolore",
                "category": "chaussettes",
                "name": "Chaussettes de sport — Pack multicolore",
                "price_xof": 3500,
                "stock": 30,
                "description": "Pack de chaussettes confortables et respirantes. Idéal pour le sport au quotidien.",
                "images": [
                    "products/chaussettes-pack-multicolore.jpeg",
                ],
            },
            {
                "slug": "chaussettes-pack-noir-blanc",
                "category": "chaussettes",
                "name": "Chaussettes de sport — Pack noir/blanc",
                "price_xof": 3000,
                "stock": 30,
                "description": "Pack noir/blanc, parfait pour l'entraînement. Maintien et confort.",
                "images": [
                    "products/chaussettes-pack-noir-blanc.jpeg",
                ],
            },
            {
                "slug": "chaussettes-noires-logo-blanc",
                "category": "chaussettes",
                "name": "Chaussettes de sport — Noir (logo blanc)",
                "price_xof": 2000,
                "stock": 25,
                "description": "Chaussettes noires avec design blanc. Bonne adhérence et confort.",
                "images": [
                    "products/chaussettes-noires-logo-blanc.jpeg",
                ],
            },
            {
                "slug": "chaussettes-blanches-logo-noir",
                "category": "chaussettes",
                "name": "Chaussettes de sport — Blanc (logo noir)",
                "price_xof": 2000,
                "stock": 25,
                "description": "Chaussettes blanches avec design noir. Respirantes et résistantes.",
                "images": [
                    "products/chaussettes-blanches-logo-noir.jpeg",
                ],
            },
            {
                "slug": "chaussettes-blanches-vertes",
                "category": "chaussettes",
                "name": "Chaussettes de sport — Blanc/Vert",
                "price_xof": 2000,
                "stock": 25,
                "description": "Chaussettes blanches avec détails verts. Confort et maintien.",
                "images": [
                    "products/chaussettes-blanches-vertes.jpeg",
                ],
            },
            {
                "slug": "chaussettes-turquoise-orange",
                "category": "chaussettes",
                "name": "Chaussettes de sport — Turquoise/Orange",
                "price_xof": 2500,
                "stock": 25,
                "description": "Chaussettes de sport turquoise avec détails orange. Style et performance.",
                "images": [
                    "products/chaussettes-turquoise-orange.jpeg",
                    "products/chaussettes-turquoise-orange-2.jpeg",
                ],
            },
            {
                "slug": "chevillere-maintien-noire",
                "category": "protection-maintien",
                "name": "Chevillère de maintien — Noir",
                "price_xof": 7000,
                "stock": 15,
                "description": "Chevillère de maintien réglable. Aide à stabiliser la cheville pendant l'effort.",
                "images": [
                    "products/chevillere-maintien-noire-face.jpeg",
                    "products/chevillere-maintien-noire-face-2.jpeg",
                    "products/chevillere-maintien-noire-profil.jpeg",
                ],
            },
            {
                "slug": "sangle-rotulienne-couleurs",
                "category": "protection-maintien",
                "name": "Sangle rotulienne (knee strap) — Couleurs",
                "price_xof": 2500,
                "stock": 25,
                "description": "Sangle rotulienne réglable. Confort et maintien pendant la course et le sport.",
                "images": [
                    "products/sangle-rotulienne-couleurs.jpeg",
                    "products/sangle-rotulienne-couleurs-2.jpeg",
                ],
            },
            {
                "slug": "sangle-rotulienne-rose",
                "category": "protection-maintien",
                "name": "Sangle rotulienne — Rose",
                "price_xof": 2500,
                "stock": 20,
                "description": "Sangle rotulienne rose, réglable et confortable.",
                "images": [
                    "products/sangle-rotulienne-rose.jpeg",
                ],
            },
            {
                "slug": "sangle-rotulienne-grise",
                "category": "protection-maintien",
                "name": "Sangle rotulienne — Grise",
                "price_xof": 2500,
                "stock": 20,
                "description": "Sangle rotulienne grise, réglable et confortable.",
                "images": [
                    "products/sangle-rotulienne-grise.jpeg",
                ],
            },
            {
                "slug": "short-compression-pro-combat-noir",
                "category": "vetements-compression",
                "name": "Short de compression — Pro Combat (noir)",
                "price_xof": 5000,
                "stock": 20,
                "description": "Short de compression pour l'entraînement. Confort et maintien musculaire.",
                "images": [
                    "products/short-compression-pro-combat-noir.jpeg",
                ],
            },
            {
                "slug": "tenues-compression-pro-combat",
                "category": "vetements-compression",
                "name": "Tenues de compression — Pro Combat",
                "price_xof": 9000,
                "stock": 10,
                "description": "Gamme de tenues de compression (différentes longueurs).",
                "images": [
                    "products/tenues-compression-pro-combat.jpeg",
                ],
            },
            {
                "slug": "manchon-protection-hex-blanc",
                "category": "protection-maintien",
                "name": "Manchon de protection rembourré (hex) — Blanc",
                "price_xof": 4000,
                "stock": 20,
                "description": "Manchon rembourré avec protection hexagonale. Idéal pour le basket et les sports de contact.",
                "images": [
                    "products/manchon-protection-hex-blanc.jpeg",
                ],
            },
        ]

        created_products = 0
        created_images = 0
        updated_products = 0

        for data in products_data:
            category = categories[data["category"]]
            product, created = Product.objects.update_or_create(
                slug=data["slug"],
                defaults={
                    "category": category,
                    "name": data["name"],
                    "description": data["description"],
                    "price_xof": data["price_xof"],
                    "stock": data["stock"],
                    "is_active": True,
                },
            )
            if created:
                created_products += 1
            else:
                updated_products += 1

            for idx, rel_path in enumerate(data["images"]):
                abs_path = Path(settings.MEDIA_ROOT) / rel_path
                if not abs_path.exists():
                    self.stdout.write(
                        self.style.WARNING(f"Image manquante: {abs_path} (produit: {product.slug})")
                    )
                    continue

                _, img_created = ProductImage.objects.update_or_create(
                    product=product,
                    image=rel_path,
                    defaults={
                        "alt_text": product.name,
                        "sort_order": idx,
                    },
                )
                if img_created:
                    created_images += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"OK — produits créés: {created_products}, produits mis à jour: {updated_products}, images ajoutées: {created_images}"
            )
        )
