import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="ms-container py-7 md:py-10">{children}</main>
      <SiteFooter />
    </>
  );
}
