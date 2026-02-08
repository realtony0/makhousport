# Makhou Sport (Next.js)

Boutique de sport en ligne basee au Senegal avec espace admin complet:
- catalogue produits
- panier et checkout
- gestion produits et commandes

## Stack

- Next.js 15 (App Router)
- React 19
- Supabase (optionnel)
- Fallback local JSON (`data/*.json`) si Supabase n est pas configure

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
- valeur par defaut: `makhouadmin123`

Exemple:

```bash
ADMIN_PASSCODE=moncode npm run dev
```

## Donnees

Par defaut, les donnees sont stockees ici:
- `data/categories.json`
- `data/products.json`
- `data/orders.json`

## Configuration Supabase (simple)

1. Creer un projet Supabase.
2. Ouvrir SQL Editor puis executer le schema: `supabase/schema.sql`.
3. Executer aussi: `supabase/storage.sql` (bucket public pour images produits).
4. Copier `.env.example` vers `.env.local` et renseigner:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_STORAGE_BUCKET` (optionnel, defaut: `products`)
5. Redemarrer le serveur Next.js.

Quand ces variables sont configurees, le backend utilise Supabase automatiquement.

## Upload images admin

- Dans `/admin/products`, l admin televerse directement les images (plus besoin d URL manuelle).
- En local sans Supabase: upload sauvegarde dans `public/uploads/products/`.
- Sur Vercel: active Supabase (variables + bucket) pour que les uploads soient persistants.

## Photos produits

Les images utilisees par la boutique sont dans:
- `public/products/`

La liste des noms produits/images:
- `docs/PHOTOS.md`
