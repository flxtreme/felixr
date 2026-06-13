import { FelixrMetadata as Metadata, Post as PublicPost } from "@/src/features/public/posts/types";
import { trimContent } from "./trim";

const parseMetadata = (post: PublicPost, slug: string, content: string, metadata?: Metadata) => {
  const seo = metadata?.seo;

  const description = post?.excerpt || seo?.description || trimContent(content);

  return {
    ...seo,
    title: seo?.title ?? post.title ?? slug,
    description,
    openGraph: {
      title: post.title,
      description,
    },
  };
};

export default parseMetadata;
