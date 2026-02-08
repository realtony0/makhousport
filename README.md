# Makhou Sport (Next.js)

Boutique de sport en ligne basee au Senegal avec espace admin complet:
- catalogue produits
- panier et checkout
- gestion produits et commandes

## Stack

- Next.js 15 (App Router)
- React 19
- Supabase (obligatoire)

## Lancer le projet

Prerequis: Node.js 20+

```bash
npm install
npm run dev
```

Application:
- Boutique: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

Important:
- Utiliser uniquement le serveur Next.js (`npm run dev`).
- Ne pas lancer `python manage.py runserver` pour la boutique Next.js, sinon vous ouvrez l ancienne version Django.
- En cas de bug `.next`, lancer `npm run dev:clean`.

## Admin

Connexion admin par code:
- variable: `ADMIN_PASSCODE`
- valeur par defaut: `150803`

Exemple:

```bash
ADMIN_PASSCODE=moncode npm run dev
```

## Donnees

Toutes les donnees passent par Supabase (categories, produits, commandes).
Si la base est vide au premier lancement, le catalogue initial est injecte automatiquement depuis `data/*.json`.

## Configuration Supabase (simple)

1. Creer un projet Supabase.
2. Ouvrir SQL Editor puis executer le schema: `supabase/schema.sql`.
3. Executer aussi: `supabase/storage.sql` (bucket public pour images produits).
4. Copier `.env.example` vers `.env.local` et renseigner:
   - `NEXT_PUBLIC_SUPABASE_URL` (deja pre-remplie avec ton projet)
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_STORAGE_BUCKET` (optionnel, defaut: `products`)
   - `WHATSAPP_ORDER_NUMBER` (numero destination des commandes, ex: `221770000000`)
5. Redemarrer le serveur Next.js.

Sans ces variables, le backend et l upload images ne fonctionnent pas.

## Upload images admin

- Dans `/admin/products`, l admin televerse directement les images (plus besoin d URL manuelle).
- Les images sont enregistrees dans Supabase Storage (bucket `products`).

## Commandes WhatsApp

- Le client prepare son panier puis valide le formulaire de commande.
- La commande est enregistree en base, puis redirigee vers WhatsApp avec un message pre-rempli.
- Le numero destination est `WHATSAPP_ORDER_NUMBER`.

## Photos produits

Les images utilisees par la boutique sont dans:
- `public/products/`

La liste des noms produits/images:
- `docs/PHOTOS.md`
