import { useState, useEffect } from "react";

interface PostMetaFieldsProps {
  title: string;
  onTitleChange: (value: string) => void;
  slug: string;
  onSlugChange: (value: string) => void;
  excerpt: string;
  onExcerptChange: (value: string) => void;
}

export const PostMetaFields = ({
  title,
  onTitleChange,
  slug,
  onSlugChange,
  excerpt,
  onExcerptChange,
}: PostMetaFieldsProps) => {
  const [isSlugEditable, setIsSlugEditable] = useState(false);

  useEffect(() => {
    if (!isSlugEditable) {
      const generated = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      onSlugChange(generated);
    }
  }, [title, isSlugEditable, onSlugChange]);

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <label className="text-sm font-mono font-medium text-foreground/40">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full bg-transparent border-b border-border py-2 text-4xl font-bold focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/10"
          placeholder="Post Title"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-mono font-medium text-foreground/40">Excerpt</label>
        <textarea
          value={excerpt}
          onChange={(e) => onExcerptChange(e.target.value)}
          className="w-full bg-transparent border-b border-border py-2 text-sm font-mono font-medium focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/10 resize-none"
          placeholder="Brief summary of the content..."
          rows={2}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-mono font-medium text-foreground/40">Slug</label>
            <button
              type="button"
              onClick={() => setIsSlugEditable((prev) => !prev)}
              className="text-xs font-mono text-foreground/40 hover:text-primary transition-colors"
            >
              {isSlugEditable ? "lock" : "edit"}
            </button>
          </div>
          <input
            type="text"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            readOnly={!isSlugEditable}
            className={`w-full bg-transparent border-b border-border py-2 text-sm font-mono font-medium focus:outline-none transition-colors placeholder:text-foreground/10 ${
              isSlugEditable ? "focus:border-primary" : "cursor-default text-foreground/50"
            }`}
            placeholder="post-slug-format"
          />
        </div>
      </div>
    </section>
  );
};
