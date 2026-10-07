import { beforeEach, describe, expect, it, vi } from "vitest";

const { fetcherMock, trackMutationMock, trackMutationErrorMock } = vi.hoisted(() => {
  const fetcherMock = vi.fn();
  const trackMutationMock = vi.fn(async ({ mutate }: { mutate: () => Promise<unknown> }) =>
    mutate()
  );
  return { fetcherMock, trackMutationMock, trackMutationErrorMock: vi.fn() };
});

vi.mock("@/src/utils/fetcher", () => ({ fetcher: fetcherMock }));
vi.mock("@/src/lib/analytics/trackAdminMutation", () => ({
  trackAdminMutation: trackMutationMock,
  trackAdminMutationError: trackMutationErrorMock,
}));
vi.mock("server-only", () => ({}));

import { login } from "@/src/features/auth/services";
import { getTrainings } from "@/src/features/public/trainings/services";
import { getStacks } from "@/src/features/public/stack/services";
import {
  getProjects as getPublicProjects,
  getProjectBySlug,
} from "@/src/features/public/projects/services";
import { getGigs } from "@/src/features/public/gigs/services";
import { getExperience, getExperienceById } from "@/src/features/public/experience/services";
import { getCertifications } from "@/src/features/public/certifications/services";
import {
  getPosts as getPublicPosts,
  getPostBySlug,
  getPostContentBySlug,
  getPostMetadataBySlug,
} from "@/src/features/public/posts/services";
import {
  getPublicPageBySlug,
  getPublicPostBySlug,
  getPublicPostContentBySlug,
  getPublicPostMetadataBySlug,
} from "@/src/features/public/posts/serverServices";
import {
  getAdminUploads,
  getAdminUploadSignedUrl,
  createAdminUpload,
} from "@/src/features/admin/uploads/services";
import { getTags, searchTags, createTag } from "@/src/features/admin/tags/services";
import {
  getAdminResources,
  getAdminResourceById,
  createAdminResource,
} from "@/src/features/admin/resources/services";
import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
} from "@/src/features/admin/products/services";
import {
  getProjects as getAdminProjects,
  createProject,
} from "@/src/features/admin/project/services";
import {
  getPosts as getAdminPosts,
  createPost,
  deletePost,
} from "@/src/features/admin/posts/services";

const mockDirectFetch = (response: Partial<Response>) => {
  const directFetch = vi.fn().mockResolvedValue(response);
  vi.stubGlobal("fetch", directFetch);
  return directFetch;
};

beforeEach(() => {
  fetcherMock.mockReset().mockResolvedValue({ ok: true });
  trackMutationMock.mockClear();
  trackMutationErrorMock.mockClear();
  vi.unstubAllGlobals();
});

describe("auth service", () => {
  it("submits login credentials as JSON to the login endpoint", async () => {
    const credentials = { username: "viy", password: "secret" };
    await login(credentials);
    expect(fetcherMock).toHaveBeenCalledWith("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  });
});

describe("public collection services", () => {
  it("includes pagination and encoded search terms in training requests", async () => {
    await getTrainings({ limit: 10, offset: 0, search: "react & typescript" });
    expect(fetcherMock).toHaveBeenCalledWith(
      "/public/training?limit=10&offset=0&search=react+%26+typescript"
    );
  });

  it("preserves zero offsets and search terms for stack listings", async () => {
    await getStacks({ limit: 5, offset: 0, search: "design systems" });
    expect(fetcherMock).toHaveBeenCalledWith(
      "/public/stack?limit=5&offset=0&search=design+systems"
    );
  });

  it("queries public projects and retrieves a project by slug", async () => {
    await getPublicProjects({ offset: 0, limit: 6, search: "portfolio" });
    await getProjectBySlug("my-project");
    expect(fetcherMock).toHaveBeenNthCalledWith(
      1,
      "/public/project?offset=0&limit=6&search=portfolio"
    );
    expect(fetcherMock).toHaveBeenNthCalledWith(2, "/public/project/my-project");
  });

  it("builds gig listing parameters", async () => {
    await getGigs({ limit: 100, offset: 0, search: "frontend" });
    expect(fetcherMock).toHaveBeenCalledWith("/public/gig?limit=100&offset=0&search=frontend");
  });

  it("queries experience and encodes experience IDs", async () => {
    await getExperience({ page: 2, limit: 10, offset: 10, search: "engineering" });
    await getExperienceById("id/with slash");
    expect(fetcherMock).toHaveBeenNthCalledWith(
      1,
      "/public/experience?page=2&limit=10&offset=10&search=engineering"
    );
    expect(fetcherMock).toHaveBeenNthCalledWith(2, "/public/experience/id%2Fwith%20slash");
  });

  it("builds certification pagination and search parameters", async () => {
    await getCertifications({ limit: 20, offset: 0, search: "vitest" });
    expect(fetcherMock).toHaveBeenCalledWith(
      "/public/certification?limit=20&offset=0&search=vitest"
    );
  });

  it("retains repeated post tags and retrieves a post by slug", async () => {
    await getPublicPosts({
      offset: 0,
      limit: 10,
      status: "PUBLISHED",
      postType: "POST",
      isActive: true,
      search: "testing",
      tags: ["frontend", "unit tests"],
    });
    await getPostBySlug("release-notes");
    expect(fetcherMock).toHaveBeenNthCalledWith(
      1,
      "/public/post?offset=0&limit=10&status=PUBLISHED&postType=POST&isActive=true&search=testing&tags=frontend&tags=unit+tests"
    );
    expect(fetcherMock).toHaveBeenNthCalledWith(2, "/public/post/slug/release-notes");
  });

  it("returns public post content and metadata with safe error fallbacks", async () => {
    const directFetch = mockDirectFetch({
      ok: true,
      text: async () => "post body",
      json: async () => ({ tags: ["a"], seo: { title: "Post" } }),
    });
    await expect(getPostContentBySlug("post-1")).resolves.toBe("post body");
    await expect(getPostMetadataBySlug("post-1")).resolves.toEqual({
      tags: ["a"],
      seo: { title: "Post" },
    });
    expect(directFetch).toHaveBeenCalledTimes(2);

    mockDirectFetch({ ok: false });
    await expect(getPostContentBySlug("missing")).resolves.toBe("");
    await expect(getPostMetadataBySlug("missing")).resolves.toEqual({ tags: [], seo: {} });
  });

  it("handles server-side post/page lookup success and unavailable content/metadata", async () => {
    const post = { id: "post-1", slug: "post", postType: "POST" };
    const directFetch = mockDirectFetch({
      ok: true,
      json: async () => post,
      text: async () => "server body",
    });
    await expect(getPublicPostBySlug("a/b")).resolves.toEqual(post);
    await expect(getPublicPageBySlug("a/b")).resolves.toEqual(post);
    await expect(getPublicPostContentBySlug("a/b")).resolves.toBe("server body");
    expect(directFetch).toHaveBeenCalledTimes(3);

    mockDirectFetch({ ok: false });
    await expect(getPublicPostBySlug("missing")).resolves.toBeNull();
    await expect(getPublicPostContentBySlug("missing")).resolves.toBe("");
    await expect(getPublicPostMetadataBySlug("missing")).resolves.toEqual({ tags: [], seo: {} });
  });
});

describe("public products service", () => {
  it("limits product search and gathers all pages from the paginated endpoint", async () => {
    const firstPage = {
      data: [{ id: "1" }, { id: "2" }],
      meta: { total: 3, offset: 0, limit: 2, page: 1 },
    };
    const secondPage = { data: [{ id: "3" }], meta: { total: 3, offset: 2, limit: 2, page: 2 } };
    fetcherMock
      .mockResolvedValueOnce({ data: [], meta: {} })
      .mockResolvedValueOnce(firstPage)
      .mockResolvedValueOnce(secondPage);

    const { searchProducts, getProducts } = await import("@/src/features/public/products/services");
    await searchProducts("web & design");
    expect(fetcherMock).toHaveBeenNthCalledWith(1, "/public/product?search=web+%26+design&limit=5");

    await expect(getProducts()).resolves.toEqual([{ id: "1" }, { id: "2" }, { id: "3" }]);
    expect(fetcherMock).toHaveBeenNthCalledWith(2, "/public/product?limit=100&offset=0");
    expect(fetcherMock).toHaveBeenNthCalledWith(3, "/public/product?limit=100&offset=2");
  });
});

describe("admin uploads service", () => {
  it("builds the upload query, adds download intent, and submits file metadata", async () => {
    await getAdminUploads({ offset: 0, limit: 25, search: "avatar" });
    await getAdminUploadSignedUrl("file/1", true);
    expect(fetcherMock).toHaveBeenNthCalledWith(1, "admin/upload?offset=0&limit=25&search=avatar");
    expect(fetcherMock).toHaveBeenNthCalledWith(
      2,
      "admin/upload/file%2F1/signed-url?download=true"
    );

    const file = new File(["image bytes"], "portrait.png", { type: "image/png" });
    await createAdminUpload({
      file,
      name: "portrait.png",
      alt: "Portrait",
      metadata: { source: "profile" },
    } as never);
    const [, options] = fetcherMock.mock.calls[2];
    expect(options.method).toBe("POST");
    expect(options.body).toBeInstanceOf(FormData);
    expect((options.body as FormData).get("metadata")).toBe('{"source":"profile"}');
  });
});

describe("admin tag service", () => {
  it("applies filter parameters, encodes search, and tracks create mutations", async () => {
    await getTags({ excludeFromPages: true, isActive: false, search: "C++", offset: 0, limit: 10 });
    expect(fetcherMock).toHaveBeenCalledWith(
      "admin/tag?excludeFromPages=true&isActive=false&search=C%2B%2B&offset=0&limit=10"
    );
    await searchTags("C++");
    expect(fetcherMock).toHaveBeenLastCalledWith("admin/tag/search?query=C%2B%2B");

    await createTag({ name: "frontend" } as never);
    expect(trackMutationMock).toHaveBeenCalledWith(expect.objectContaining({ action: "insert" }));
    expect(fetcherMock).toHaveBeenLastCalledWith(
      "admin/tag",
      expect.objectContaining({ method: "POST", body: '{"name":"frontend"}' })
    );
  });
});

describe("admin resources service", () => {
  it("passes active/search filters, encodes record IDs, and creates through tracked mutations", async () => {
    await getAdminResources("user", { offset: 0, limit: 10, search: "alex", isActive: false });
    await getAdminResourceById("user", "a/b");
    expect(fetcherMock).toHaveBeenNthCalledWith(
      1,
      "admin/user?offset=0&limit=10&search=alex&isActive=false"
    );
    expect(fetcherMock).toHaveBeenNthCalledWith(2, "admin/user/a%2Fb");

    await createAdminResource("user", { name: "Alex" });
    expect(trackMutationMock).toHaveBeenCalledWith(expect.objectContaining({ action: "insert" }));
    expect(fetcherMock).toHaveBeenLastCalledWith(
      "admin/user",
      expect.objectContaining({ method: "POST", body: '{"name":"Alex"}' })
    );
  });
});

describe("admin products service", () => {
  it("preserves false filters, and tracks product creation with the expected payload", async () => {
    await getAdminProducts({ offset: 0, limit: 10, search: "design", isDeleted: false });
    expect(fetcherMock).toHaveBeenCalledWith(
      "admin/product?offset=0&limit=10&search=design&isDeleted=false"
    );

    await createAdminProduct({ title: "Template" } as never);
    expect(trackMutationMock).toHaveBeenCalledWith(expect.objectContaining({ action: "insert" }));
    expect(fetcherMock).toHaveBeenLastCalledWith(
      "admin/product",
      expect.objectContaining({ method: "POST", body: '{"title":"Template"}' })
    );
  });

  it("tracks product update including pin state toggle", async () => {
    fetcherMock.mockResolvedValueOnce({ id: "prod-1", isPinned: false });
    fetcherMock.mockResolvedValueOnce({ id: "prod-1", isPinned: true });

    await updateAdminProduct("prod-1", { isPinned: true });
    expect(trackMutationMock).toHaveBeenCalledWith(
      expect.objectContaining({ action: "update", path: ["admin", "product", "prod-1"] })
    );
    expect(fetcherMock).toHaveBeenLastCalledWith(
      "admin/product/prod-1",
      expect.objectContaining({ method: "PUT", body: '{"isPinned":true}' })
    );
  });
});

describe("admin project service", () => {
  it("serializes defined project filters and tracks project creation", async () => {
    await getAdminProjects({ offset: 0, limit: 5, search: "site", isActive: false } as never);
    expect(fetcherMock).toHaveBeenCalledWith(
      "admin/project?offset=0&limit=5&search=site&isActive=false"
    );

    await createProject({ title: "Portfolio" } as never);
    expect(trackMutationMock).toHaveBeenCalledWith(expect.objectContaining({ action: "insert" }));
    expect(fetcherMock).toHaveBeenLastCalledWith(
      "admin/project",
      expect.objectContaining({ method: "POST", body: '{"title":"Portfolio"}' })
    );
  });
});

describe("admin post service", () => {
  it("builds multi-filter post queries and tracks create and permanent deletion actions", async () => {
    await getAdminPosts({
      search: "vitest",
      offset: 0,
      limit: 10,
      status: "DRAFT",
      postType: "POST",
      tags: ["unit", "frontend"],
    });
    expect(fetcherMock).toHaveBeenCalledWith(
      "/admin/post?search=vitest&offset=0&limit=10&status=DRAFT&postType=POST&tags=unit&tags=frontend"
    );

    await createPost({ title: "Test post" } as never);
    expect(trackMutationMock).toHaveBeenLastCalledWith(
      expect.objectContaining({ action: "insert" })
    );
    await deletePost("post-1", { isPermanent: true } as never);
    expect(trackMutationMock).toHaveBeenLastCalledWith(
      expect.objectContaining({ action: "delete" })
    );
    expect(fetcherMock).toHaveBeenLastCalledWith(
      "/admin/post/post-1",
      expect.objectContaining({ method: "DELETE" })
    );
  });
});
