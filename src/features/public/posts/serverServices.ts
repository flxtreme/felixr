import "server-only";

import type { Post } from "@/src/features/public/posts/types";
import type { FelixrMetadata } from "@/src/features/public/posts/types";

const API_URL = process.env.API_URL || "http://localhost:3200";

const publicApiFetch = (path: string) =>
  fetch(`${API_URL}/api/public/post/${path}`, {
    cache: "no-store",
    headers: process.env.API_KEY ? { "X-API-Key": process.env.API_KEY } : undefined,
  });

export async function getPublicPostBySlug(slug: string): Promise<Post | null> {
  try {
    const response = await publicApiFetch(encodeURIComponent(slug));
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function getPublicPageBySlug(slug: string): Promise<Post | null> {
  try {
    const response = await publicApiFetch(`page/${encodeURIComponent(slug)}`);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export async function getPublicPostContentBySlug(slug: string): Promise<string> {
  try {
    const response = await publicApiFetch(`${encodeURIComponent(slug)}/content`);
    if (!response.ok) return "";
    return response.text();
  } catch {
    return "";
  }
}

export async function getPublicPostMetadataBySlug(slug: string): Promise<FelixrMetadata> {
  try {
    const response = await publicApiFetch(`${encodeURIComponent(slug)}/metadata`);
    if (!response.ok) return { tags: [], seo: {} };
    return response.json();
  } catch {
    return { tags: [], seo: {} };
  }
}
