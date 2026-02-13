"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Accueil admin" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/products", label: "Produits" },
  { href: "/admin/orders", label: "Commandes" },
  { href: "/admin/settings", label: "Controle site" }
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {links.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-black transition",
              active
                ? "bg-white text-ink-950 shadow-soft"
                : "border border-white/20 bg-white/10 text-white hover:bg-white/20"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
