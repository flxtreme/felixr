import { PostProvider } from "@/src/features/admin/posts/PostsContext";

export default function PostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PostProvider>{children}</PostProvider>;
}
