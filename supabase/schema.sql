create table if not exists categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text not null default ''
);

create table if not exists products (
  id text primary key,
  name text not null,
  slug text not null unique,
  category_id text not null references categories(id) on delete restrict,
  description text not null default '',
  price_xof integer not null check (price_xof >= 0),
  compare_at_price_xof integer check (compare_at_price_xof >= 0),
  stock integer not null default 0 check (stock >= 0),
  is_active boolean not null default true,
  featured boolean not null default false,
  images text[] not null default '{}'::text[]
);

create table if not exists orders (
  id text primary key,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  address text not null,
  city text not null,
  notes text,
  payment_method text not null check (payment_method in ('cash', 'orange-money', 'wave')),
  status text not null check (status in ('pending', 'confirmed', 'paid', 'shipped', 'completed', 'canceled')),
  total_xof integer not null check (total_xof >= 0),
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id bigserial primary key,
  order_id text not null references orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price_xof integer not null check (unit_price_xof >= 0),
  line_total_xof integer not null check (line_total_xof >= 0)
);

create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_active on products(is_active);
create index if not exists idx_orders_created_at on orders(created_at desc);
create index if not exists idx_order_items_order on order_items(order_id);
