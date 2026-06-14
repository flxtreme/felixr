import Link from "next/link";

export interface TagProps {
  tags: string[]
}

export function TagHeader( props: TagProps ) {
  const { tags } = props;

  if (tags.length === 0) return undefined;

  return (
    <div>
      {tags.map((tag, i) => {

        return(
          <Link
            key={`tag-${tag}-${i}`}
            href={`/tags/${tag}`}>
            {tag}
          </Link>
        )
      })}
    </div>
  )
}

export function TagFooter( props: TagProps ) {
  const { tags } = props;

  if (tags.length === 0) return undefined;

  return (
    <div className="border-t border-border pt-8 mt-8">
      <div className="inline-flex gap-2">
        <span className="mr-2 font-bold">Tags:</span>
        {tags.map((tag, i) => {

          return(
            <Link
              className="underline"
              key={`tag-${tag}-${i}`}
              href={`/tags/${tag}`}>
              {tag}
            </Link>
          )
        })}
      </div>
    </div>
  )
}