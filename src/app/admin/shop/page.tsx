import AdminShopView from "@/src/views/admin/shop/AdminShopView";

export default function Page({ searchParams }: { searchParams: Promise<{ search?: string; status?: string }> }) {
  return <AdminShopView searchParams={searchParams} />;
}
