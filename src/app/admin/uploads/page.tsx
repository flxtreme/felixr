import AdminUploadsView from "@/src/views/admin/uploads/AdminUploadsView";

export default function Page({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  return <AdminUploadsView searchParams={searchParams} />;
}
