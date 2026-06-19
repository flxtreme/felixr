import { ProjectProvider } from "@/src/features/admin/project/ProjectContext";


export default function ProjectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProjectProvider>{children}</ProjectProvider>;
}
