import { DashboardContextProvider } from "@/src/features/admin/DashboardContext";
import { AuthGuard } from "@/src/guards/AuthGuard";
import DashboardLayout from "@/src/layouts/DashoardLayout";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <DashboardContextProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </DashboardContextProvider>
    </AuthGuard>
  );
}
