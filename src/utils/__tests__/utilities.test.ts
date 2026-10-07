import { describe, expect, it } from "vitest";
import { formatDate, formatShortDate } from "@/src/utils/date";
import parseMetadata from "@/src/utils/parseMetadata";
import { stringToKey } from "@/src/utils/string";
import { trimContent } from "@/src/utils/trim";
import type { Post } from "@/src/features/public/posts/types";

const post: Post = {
  id: "post-1",
  slug: "my-post",
  title: "Post title",
  excerpt: null,
  status: "PUBLISHED",
  postType: "POST",
  publishedAt: null,
  featureImages: [],
  userId: "user-1",
  isDeleted: false,
  deletedAt: null,
  createdBy: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

describe("content utilities", () => {
  it("normalizes a phrase into a lowercase key", () => {
    expect(stringToKey("React JS / TypeScript")).toBe("react_js_typescript");
  });

  it("removes common markdown markers and normalizes whitespace", () => {
    expect(trimContent("# Hello **world**\n> with `code`")).toBe("Hello world with code");
  });

  it("limits trimmed content to 160 characters", () => {
    expect(trimContent("a".repeat(200))).toHaveLength(160);
  });
});

describe("date formatting", () => {
  it("formats a year-month value without local-time shifts", () => {
    expect(formatShortDate("2024-02")).toBe("Feb 2024");
  });

  it("returns an empty string for invalid dates", () => {
    expect(formatShortDate("2024-13")).toBe("");
    expect(formatShortDate(null)).toBe("");
    expect(formatDate(undefined)).toBe("");
  });

  it("formats valid date-time input with a readable month, day, and year", () => {
    expect(formatDate("2024-03-05T12:34:00Z")).toMatch(/Mar \d{2}, 2024 \d{2}:34 (am|pm)/);
  });
});

describe("parseMetadata", () => {
  it("prioritizes post excerpts while retaining SEO fields and creating Open Graph metadata", () => {
    const result = parseMetadata(
      { ...post, excerpt: "Post excerpt" },
      "fallback-slug",
      "Ignored body",
      {
        tags: [],
        seo: { title: "SEO title", description: "SEO description", keywords: ["portfolio"] },
      }
    );

    expect(result).toMatchObject({
      title: "SEO title",
      description: "Post excerpt",
      keywords: ["portfolio"],
      openGraph: { title: "Post title", description: "Post excerpt" },
    });
  });

  it("falls back from empty excerpt to SEO description, then to trimmed content", () => {
    expect(
      parseMetadata({ ...post, excerpt: "" }, "slug", "# body", {
        tags: [],
        seo: { description: "SEO description" },
      }).description
    ).toBe("SEO description");
    expect(parseMetadata(post, "slug", "# body **text**").description).toBe("body text");
  });

  it("uses the slug when SEO and post titles are empty", () => {
    expect(
      parseMetadata({ ...post, title: undefined as unknown as string }, "fallback-slug", "", {
        tags: [],
        seo: {},
      }).title
    ).toBe("fallback-slug");
  });
});
