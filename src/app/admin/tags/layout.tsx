import { TagsProvider } from "@/src/features/admin/tags/TagsContext";

export default function TagLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <TagsProvider>{children}</TagsProvider>
}
