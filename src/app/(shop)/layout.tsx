import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="ms-container py-5 md:py-8 lg:py-10">{children}</main>
      <SiteFooter />
    </>
  );
}
