begin;

insert into categories (id, name, slug, description)
values
  ('cat-socks', 'Chaussettes', 'chaussettes', 'Chaussettes de sport confortables pour entrainement et match.'),
  ('cat-compression', 'Vetements de compression', 'vetements-compression', 'Shorts et tenues de compression pour performance.'),
  ('cat-protection', 'Protection et maintien', 'protection-maintien', 'Chevillieres, sangles rotuliennes et manchons de protection.')
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description;

with seed_products (id, name, slug, category_slug, description, price_xof, compare_at_price_xof, stock, is_active, featured, images) as (
  values
    (
      'p-socks-white-logo',
      'Chaussettes blanches logo noir',
      'chaussettes-blanches-logo-noir',
      'chaussettes',
      'Modele blanc polyvalent pour football et fitness.',
      2000,
      null,
      26,
      true,
      false,
      array['/products/chaussettes-blanches-logo-noir.jpeg']::text[]
    ),
    (
      'p-socks-white-green',
      'Chaussettes blanches vertes',
      'chaussettes-blanches-vertes',
      'chaussettes',
      'Chaussettes avec zones de maintien pour le pied.',
      2000,
      null,
      20,
      true,
      false,
      array['/products/chaussettes-blanches-vertes.jpeg']::text[]
    ),
    (
      'p-socks-black-logo',
      'Chaussettes noires logo blanc',
      'chaussettes-noires-logo-blanc',
      'chaussettes',
      'Modele noir avec renforts a la cheville.',
      2000,
      null,
      25,
      true,
      false,
      array['/products/chaussettes-noires-logo-blanc.jpeg']::text[]
    ),
    (
      'p-socks-pack-multi',
      'Chaussettes sport pack multicolore',
      'chaussettes-pack-multicolore',
      'chaussettes',
      'Pack de chaussettes respirantes pour entrainements intensifs.',
      3500,
      4500,
      29,
      true,
      true,
      array['/products/chaussettes-pack-multicolore.jpeg']::text[]
    ),
    (
      'p-socks-pack-bw',
      'Chaussettes sport pack noir blanc',
      'chaussettes-pack-noir-blanc',
      'chaussettes',
      'Pack noir et blanc, tenue ferme et confort quotidien.',
      3000,
      null,
      32,
      true,
      true,
      array['/products/chaussettes-pack-noir-blanc.jpeg']::text[]
    ),
    (
      'p-socks-turq',
      'Chaussettes turquoise orange',
      'chaussettes-turquoise-orange',
      'chaussettes',
      'Modele technique avec zones anti-frottement.',
      2500,
      null,
      22,
      true,
      true,
      array['/products/chaussettes-turquoise-orange.jpeg', '/products/chaussettes-turquoise-orange-2.jpeg']::text[]
    ),
    (
      'p-ankle-black',
      'Chevillere maintien noire',
      'chevillere-maintien-noire',
      'protection-maintien',
      'Chevillere reglable pour stabiliser la cheville a l effort.',
      7000,
      null,
      15,
      true,
      true,
      array['/products/chevillere-maintien-noire-face.jpeg', '/products/chevillere-maintien-noire-face-2.jpeg', '/products/chevillere-maintien-noire-profil.jpeg']::text[]
    ),
    (
      'p-sleeve-hex-white',
      'Manchon protection hex blanc',
      'manchon-protection-hex-blanc',
      'protection-maintien',
      'Manchon rembourre pour protection coude ou genou.',
      4000,
      null,
      22,
      true,
      true,
      array['/products/manchon-protection-hex-blanc.jpeg']::text[]
    ),
    (
      'p-knee-strap-color',
      'Sangle rotulienne couleurs',
      'sangle-rotulienne-couleurs',
      'protection-maintien',
      'Sangle rotulienne ajustable pour course et training.',
      2500,
      null,
      24,
      true,
      true,
      array['/products/sangle-rotulienne-couleurs.jpeg', '/products/sangle-rotulienne-couleurs-2.jpeg']::text[]
    ),
    (
      'p-knee-strap-gray',
      'Sangle rotulienne grise',
      'sangle-rotulienne-grise',
      'protection-maintien',
      'Version grise, fixation velcro rapide.',
      2500,
      null,
      18,
      true,
      false,
      array['/products/sangle-rotulienne-grise.jpeg']::text[]
    ),
    (
      'p-knee-strap-pink',
      'Sangle rotulienne rose',
      'sangle-rotulienne-rose',
      'protection-maintien',
      'Version rose, souple et confortable.',
      2500,
      null,
      18,
      true,
      false,
      array['/products/sangle-rotulienne-rose.jpeg']::text[]
    ),
    (
      'p-short-compress',
      'Short compression Pro Combat noir',
      'short-compression-pro-combat-noir',
      'vetements-compression',
      'Short de compression leger pour maintien musculaire.',
      5000,
      null,
      20,
      true,
      true,
      array['/products/short-compression-pro-combat-noir.jpeg']::text[]
    ),
    (
      'p-set-compress',
      'Tenues compression Pro Combat',
      'tenues-compression-pro-combat',
      'vetements-compression',
      'Collection de coupes compression pour homme.',
      9000,
      null,
      10,
      true,
      true,
      array['/products/tenues-compression-pro-combat.jpeg']::text[]
    )
)
insert into products (
  id,
  name,
  slug,
  category_id,
  description,
  price_xof,
  compare_at_price_xof,
  stock,
  is_active,
  featured,
  images
)
select
  sp.id,
  sp.name,
  sp.slug,
  c.id,
  sp.description,
  sp.price_xof,
  sp.compare_at_price_xof,
  sp.stock,
  sp.is_active,
  sp.featured,
  sp.images
from seed_products sp
join categories c on c.slug = sp.category_slug
on conflict (slug) do update
set
  name = excluded.name,
  category_id = excluded.category_id,
  description = excluded.description,
  price_xof = excluded.price_xof,
  compare_at_price_xof = excluded.compare_at_price_xof,
  stock = excluded.stock,
  is_active = excluded.is_active,
  featured = excluded.featured,
  images = excluded.images;

commit;
