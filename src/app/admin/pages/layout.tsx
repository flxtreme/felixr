import { PagesProvider } from "@/src/features/admin/pages/PagesContext";

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return <PagesProvider>{children}</PagesProvider>;
}
