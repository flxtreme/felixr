import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import TrainingsView from "@/src/views/trainings/TrainingsView";
import StackView from "@/src/views/stack/StackView";
import ShopView from "@/src/views/shop/ShopView";
import ProjectsListView from "@/src/views/projects/ProjectsListView";
import ProjectDetailView, {
  generateMetadata as projectMetadata,
} from "@/src/views/projects/ProjectDetailView";
import CustomPageView, {
  generateMetadata as customPageMetadata,
} from "@/src/views/pages/CustomPageView";
import HomeView from "@/src/views/home/HomeView";
import GigsView from "@/src/views/gigs/GigsView";
import ExperienceView from "@/src/views/experience/ExperienceView";
import CertificationsView from "@/src/views/certifications/CertificationsView";
import AdminUploadsView from "@/src/views/admin/uploads/AdminUploadsView";
import AdminShopView from "@/src/views/admin/shop/AdminShopView";
import AdminProductFormView from "@/src/views/admin/shop/AdminProductFormView";
import PostsListView from "@/src/views/admin/posts/PostsListView";
import LoginView from "@/src/views/auth/LoginView";
import PostEditView from "@/src/views/admin/posts/PostEditView";
import PostCreateView from "@/src/views/admin/posts/PostCreateView";
import BlogPostView, { generateMetadata as blogPostMetadata } from "@/src/views/blog/BlogPostView";
import BlogListView from "@/src/views/blog/BlogListView";
import AdminResourcePage from "@/src/views/admin/resources/AdminResourcePage";
import DashboardView from "@/src/views/admin/DashboardView";
import AdminProjectsListView from "@/src/views/admin/projects/ProjectsListView";
import ProjectEditView from "@/src/views/admin/projects/ProjectEditView";
import ProjectCreateView from "@/src/views/admin/projects/ProjectCreateView";
import PageCreateView from "@/src/views/admin/pages/PageCreateView";
import PageEditView from "@/src/views/admin/pages/PageEditView";
import PagesListView from "@/src/views/admin/pages/PagesListView";
import AnalyticsView from "@/src/views/admin/analytics/AnalyticsView";

const mocks = vi.hoisted(() => {
  return {
    useTrainings: vi.fn(() => ({ trainings: [], error: undefined, isLoading: false })),
    useStacks: vi.fn(() => ({ stacks: [], error: undefined, isLoading: false })),
    useGigs: vi.fn(() => ({ gigs: [], error: undefined, isLoading: false })),
    useExperience: vi.fn(() => ({ experience: [], error: undefined, isLoading: false })),
    useCertifications: vi.fn(() => ({ certifications: [], error: undefined, isLoading: false })),
    useProducts: vi.fn(() => ({ products: [], error: undefined, isLoading: false })),
    usePublicPosts: vi.fn(() => ({
      posts: [],
      error: undefined,
      meta: { total: 0 },
      isLoading: false,
    })),
    usePublicProjects: vi.fn(() => ({
      projects: [],
      error: undefined,
      meta: { total: 0 },
      isLoading: false,
    })),
    useAdminPosts: vi.fn(() => ({
      posts: [],
      error: undefined,
      meta: { total: 0 },
      isLoading: false,
    })),
    useAdminProjects: vi.fn(() => ({
      projects: [],
      error: undefined,
      meta: { total: 0 },
      isLoading: false,
    })),
    useAdminUploads: vi.fn(() => ({
      uploads: [],
      meta: { total: 0 },
      error: undefined,
      isLoading: false,
    })),
    useAdminProducts: vi.fn(() => ({
      products: [],
      meta: { total: 0 },
      error: undefined,
      isLoading: false,
    })),
    useAdminProduct: vi.fn(() => ({ product: undefined, error: undefined, isLoading: false })),
    useAdminResources: vi.fn(() => ({ records: [], total: 0, error: undefined, isLoading: false })),
    usePost: vi.fn(() => ({ post: undefined, error: undefined, isLoading: false })),
    usePostContent: vi.fn(() => ({ content: "", error: undefined, isLoading: false })),
    usePostMetadata: vi.fn(() => ({ metadata: undefined, error: undefined, isLoading: false })),
    useProject: vi.fn(() => ({ project: undefined, error: undefined, isLoading: false })),
    useAdminProductActions: vi.fn(() => ({ create: vi.fn(), update: vi.fn(), remove: vi.fn() })),
    useAdminResourceActions: vi.fn(() => ({ create: vi.fn(), update: vi.fn(), remove: vi.fn() })),
    usePostContext: vi.fn(() => ({
      createPost: vi.fn(),
      updatePost: vi.fn(),
      removePost: vi.fn(),
      tagInput: "",
      setTagInput: vi.fn(),
      showSuggestions: false,
      setShowSuggestions: vi.fn(),
      searchResults: [],
      isSearching: false,
    })),
    usePagesContext: vi.fn(() => ({
      createPage: vi.fn(),
      updatePage: vi.fn(),
      removePage: vi.fn(),
      tagInput: "",
      setTagInput: vi.fn(),
      showSuggestions: false,
      setShowSuggestions: vi.fn(),
      searchResults: [],
      isSearching: false,
    })),
    useProjectContext: vi.fn(() => ({
      createProject: vi.fn(),
      updateProject: vi.fn(),
      removeProject: vi.fn(),
    })),
    useDashboard: vi.fn(() => ({
      user: { username: "admin" },
      setDashboardTitle: vi.fn(),
      setRightPanel: vi.fn(),
      setGoBackUrl: vi.fn(),
    })),
    useLayout: vi.fn(() => ({ setRightPanel: vi.fn() })),
    useAuthActions: vi.fn(() => ({
      signIn: vi.fn().mockRejectedValue(new Error("invalid")),
      signOut: vi.fn(),
    })),
    useModal: vi.fn(() => ({ openModal: vi.fn(), closeModal: vi.fn() })),
    router: { push: vi.fn(), replace: vi.fn(), refresh: vi.fn() },
    searchParams: new URLSearchParams(),
    swr: vi.fn(() => ({
      data: { data: [], meta: { total: 0 } },
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
    })),
    serverPost: vi.fn(),
    serverPage: vi.fn(),
    serverContent: vi.fn(),
    serverMetadata: vi.fn(),
  };
});

vi.mock("next/navigation", () => ({
  useRouter: () => mocks.router,
  useParams: () => ({ id: "entity-1" }),
  useSearchParams: () => mocks.searchParams,
  usePathname: () => "/",
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href as string} {...props}>
      {children}
    </a>
  ),
}));
vi.mock("next/image", () => ({
  default: ({
    priority: _priority,
    fill: _fill,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean; fill?: boolean }) => (
    <img {...props} />
  ),
}));
vi.mock("swr", () => ({ default: mocks.swr, mutate: vi.fn() }));
vi.mock("flxtheme", () => ({
  Button: ({
    children,
    fullWidth: _fullWidth,
    loading: _loading,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    fullWidth?: boolean;
    loading?: boolean;
  }) => <button {...props}>{children}</button>,
  Card: ({ children }: React.HTMLAttributes<HTMLDivElement>) => <div>{children}</div>,
  CardHeader: ({ children }: React.HTMLAttributes<HTMLDivElement>) => <div>{children}</div>,
  CardBody: ({ children }: React.HTMLAttributes<HTMLDivElement>) => <div>{children}</div>,
  IconButton: ({
    icon,
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: React.ReactNode }) => (
    <button {...props}>
      {icon}
      {children}
    </button>
  ),
  Modal: ({ children }: React.HTMLAttributes<HTMLDivElement>) => <div>{children}</div>,
  Pagination: () => null,
  Tabs: ({ children }: React.HTMLAttributes<HTMLDivElement>) => <div>{children}</div>,
  TabsList: ({ children }: React.HTMLAttributes<HTMLDivElement>) => <div>{children}</div>,
  TabsTrigger: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
  Breadcrumb: ({ children }: React.HTMLAttributes<HTMLElement>) => <nav>{children}</nav>,
  BreadcrumbItem: ({ children, href }: React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
    href ? <a href={href}>{children}</a> : <span>{children}</span>,
  useModal: mocks.useModal,
}));
vi.mock("flxtheme/icons/fi", () => ({
  FiPlus: () => <span aria-hidden="true">+</span>,
  FiEdit: () => null,
  FiTrash2: () => null,
}));
vi.mock("flxtheme/icons/lu", () => ({
  LuArrowUpRight: () => null,
  LuEye: () => null,
  LuFileText: () => null,
  LuFolderKanban: () => null,
  LuLayoutPanelLeft: () => null,
}));
vi.mock("@/src/features/public/trainings/hooks/useTrainings", () => ({
  default: mocks.useTrainings,
}));
vi.mock("@/src/features/public/stack/hooks/useStacks", () => ({ default: mocks.useStacks }));
vi.mock("@/src/features/public/gigs/hooks/useGigs", () => ({ useGigs: mocks.useGigs }));
vi.mock("@/src/features/public/experience/hooks/useExperience", () => ({
  useExperience: mocks.useExperience,
}));
vi.mock("@/src/features/public/certifications/hooks/useCertifications", () => ({
  default: mocks.useCertifications,
}));
vi.mock("@/src/features/public/products/hooks/useProducts", () => ({
  useProducts: mocks.useProducts,
}));
vi.mock("@/src/features/public/posts/hooks", () => ({
  usePosts: mocks.usePublicPosts,
  default: mocks.usePublicPosts,
}));
vi.mock("@/src/features/public/projects/hooks", () => ({
  useProjects: mocks.usePublicProjects,
  useProjectBySlug: vi.fn(),
}));
vi.mock("@/src/features/admin/posts/hooks", () => ({
  usePosts: mocks.useAdminPosts,
  usePost: mocks.usePost,
  usePostContent: mocks.usePostContent,
  usePostMetadata: mocks.usePostMetadata,
  usePostBySlug: vi.fn(),
}));
vi.mock("@/src/features/admin/project/hooks", () => ({
  useProjects: mocks.useAdminProjects,
  useProject: mocks.useProject,
  useProjectActions: vi.fn(),
}));
vi.mock("@/src/features/admin/products/hooks/useAdminProducts", () => ({
  useAdminProducts: mocks.useAdminProducts,
  useAdminProduct: mocks.useAdminProduct,
}));
vi.mock("@/src/features/admin/products/hooks/useAdminProductActions", () => ({
  useAdminProductActions: mocks.useAdminProductActions,
}));
vi.mock("@/src/features/admin/resources/hooks/useAdminResources", () => ({
  useAdminResources: mocks.useAdminResources,
}));
vi.mock("@/src/features/admin/resources/hooks/useAdminResourceActions", () => ({
  useAdminResourceActions: mocks.useAdminResourceActions,
}));
vi.mock("@/src/features/admin/uploads/hooks", () => ({
  useAdminUploads: mocks.useAdminUploads,
  registerAdminUpload: vi.fn(),
  editAdminUpload: vi.fn(),
  removeAdminUpload: vi.fn(),
}));
vi.mock("@/src/features/admin/posts/PostsContext", () => ({
  usePostContext: mocks.usePostContext,
}));
vi.mock("@/src/features/admin/pages/PagesContext", () => ({
  usePagesContext: mocks.usePagesContext,
}));
vi.mock("@/src/features/admin/project/ProjectContext", () => ({
  useProjectContext: mocks.useProjectContext,
}));
vi.mock("@/src/features/admin/DashboardContext", () => ({ useDashboard: mocks.useDashboard }));
vi.mock("@/src/layouts/LayoutContext", () => ({ useLayout: mocks.useLayout }));
vi.mock("@/src/features/auth/hooks", () => ({ useAuthActions: mocks.useAuthActions }));
vi.mock("@/src/components/ThemeModeToggle", () => ({ ThemeModeToggle: () => null }));
vi.mock("@/src/features/public/posts/serverServices", () => ({
  getPublicPostBySlug: mocks.serverPost,
  getPublicPageBySlug: mocks.serverPage,
  getPublicPostContentBySlug: mocks.serverContent,
  getPublicPostMetadataBySlug: mocks.serverMetadata,
}));
vi.mock("@/src/lib/analytics/useViews", () => ({ PageViews: () => null, useAnalytics: vi.fn() }));
vi.mock("@/src/lib/analytics/useAnalytics", () => ({ useAnalytics: vi.fn() }));
vi.mock("@/src/components/PostRenderer", () => ({
  default: ({ content }: { content: string }) => <div data-testid="post-content">{content}</div>,
}));

afterEach(cleanup);
beforeEach(() => vi.clearAllMocks());

const renderWithParams = async (
  view: React.ComponentType<{ searchParams: Promise<Record<string, string>> }>
) => {
  const View = view;
  await act(async () => render(<View searchParams={Promise.resolve({})} />));
};

describe("public page views", () => {
  it("shows the training empty state", () => {
    render(<TrainingsView />);
    expect(screen.getByText("No trainings available yet.")).toBeTruthy();
  });

  it("shows the stack empty state", () => {
    render(<StackView />);
    expect(screen.getByText("No tools and practices yet.")).toBeTruthy();
  });

  it("shows the empty shop state", () => {
    render(<ShopView />);
    expect(screen.getByText("It will be added soon.")).toBeTruthy();
  });

  it("constrains public project lists to five items per page", async () => {
    await act(async () =>
      render(<ProjectsListView searchParams={Promise.resolve({ page: "2" })} />)
    );
    expect(mocks.usePublicProjects).toHaveBeenCalledWith({ offset: 5, limit: 5 });
  });

  it("renders the home hero and directory sections", () => {
    render(<HomeView />);
    expect(screen.getByText(/available for work/i)).toBeTruthy();
  });

  it("shows the gigs empty state", () => {
    render(<GigsView />);
    expect(screen.getByText(/no gigs are available right now/i)).toBeTruthy();
  });

  it("shows the experience empty state and installs a directory panel", () => {
    render(<ExperienceView />);
    expect(screen.getByRole("heading", { name: "Career history." })).toBeTruthy();
    expect(mocks.useLayout).toHaveBeenCalled();
  });

  it("shows the certifications empty state", () => {
    render(<CertificationsView />);
    expect(screen.getByText("No certifications available yet.")).toBeTruthy();
  });

  it("uses page and post query parameters for public blog pagination", async () => {
    await act(async () => render(<BlogListView searchParams={Promise.resolve({ page: "3" })} />));
    expect(mocks.usePublicPosts).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 5, offset: 10, postType: "POST", status: "PUBLISHED" })
    );
  });
});

describe("server-rendered page views", () => {
  it("rejects reserved project slugs in metadata and page rendering", async () => {
    mocks.serverPage.mockResolvedValue(null);
    mocks.serverContent.mockResolvedValue("");
    await expect(projectMetadata({ params: Promise.resolve({ slug: "blog" }) })).resolves.toEqual(
      {}
    );
    const element = await ProjectDetailView({ params: Promise.resolve({ slug: "blog" }) });
    render(element);
    expect(screen.getByRole("heading", { name: /404 page not found/i })).toBeTruthy();
  });

  it("rejects reserved custom page slugs", async () => {
    mocks.serverPage.mockResolvedValue(null);
    mocks.serverContent.mockResolvedValue("");
    await expect(
      customPageMetadata({ params: Promise.resolve({ slug: "projects" }) })
    ).resolves.toEqual({});
    const element = await CustomPageView({ params: Promise.resolve({ slug: "projects" }) });
    render(element);
    expect(screen.getByRole("heading", { name: /404 page not found/i })).toBeTruthy();
  });

  it("builds blog metadata from a found post and renders its content", async () => {
    const post = {
      id: "p1",
      slug: "hello",
      title: "Hello",
      excerpt: "Excerpt",
      status: "PUBLISHED",
      postType: "POST",
      publishedAt: null,
      featureImages: [],
      userId: "u1",
      isDeleted: false,
      deletedAt: null,
      createdBy: null,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };
    mocks.serverPost.mockResolvedValue(post);
    mocks.serverMetadata.mockResolvedValue({ tags: [], seo: { title: "SEO hello" } });
    mocks.serverContent.mockResolvedValue("Article body");
    await expect(
      blogPostMetadata({ params: Promise.resolve({ slug: "hello" }) })
    ).resolves.toMatchObject({ title: "SEO hello", description: "Excerpt" });
    const element = await BlogPostView({ params: Promise.resolve({ slug: "hello" }) });
    render(element);
    expect(screen.getByTestId("post-content").textContent).toContain("Article body");
  });
});

describe("admin page views", () => {
  it("renders the upload manager and empty listing", async () => {
    await renderWithParams(AdminUploadsView);
    expect(screen.getByText("uploads")).toBeTruthy();
  });

  it("renders the shop manager with the requested empty product state", async () => {
    await renderWithParams(AdminShopView);
    expect(screen.getByText("shop")).toBeTruthy();
  });

  it("renders product cards with pin controls and toggles pin state", async () => {
    const updateMock = vi.fn().mockResolvedValue({ id: "prod-1", isPinned: true });
    mocks.useAdminProductActions.mockReturnValue({
      create: vi.fn(),
      update: updateMock,
      remove: vi.fn(),
    });
    mocks.useAdminProducts.mockReturnValue({
      products: [
        {
          id: "prod-1",
          title: "Pinned Template",
          description: "A nice template",
          price: 19.99,
          category: "templates",
          image: "/images/prod-1.png",
          link: "https://example.com/item",
          actionType: "redirect",
          actionLabel: "Buy",
          isPinned: false,
          isDeleted: false,
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-01T00:00:00Z",
        },
      ],
      meta: { total: 1, offset: 0, limit: 10, page: 1 },
      isLoading: false,
      error: undefined,
    } as never);

    await renderWithParams(AdminShopView);
    expect(screen.getByText("Pinned Template")).toBeTruthy();
    const pinButton = screen.getByRole("button", { name: /pin product “pinned template”/i });
    expect(pinButton).toBeTruthy();
    expect(pinButton.getAttribute("aria-pressed")).toBe("false");

    await act(async () => {
      fireEvent.click(pinButton);
    });
    expect(updateMock).toHaveBeenCalledWith("prod-1", { isPinned: true });
  });

  it("surfaces error when toggling pin fails in AdminShopView", async () => {
    const updateMock = vi.fn().mockRejectedValue(new Error("Failed to update pin"));
    mocks.useAdminProductActions.mockReturnValue({
      create: vi.fn(),
      update: updateMock,
      remove: vi.fn(),
    });
    mocks.useAdminProducts.mockReturnValue({
      products: [
        {
          id: "prod-1",
          title: "Test Item",
          description: "Description",
          price: 10,
          category: "tools",
          image: "/img.png",
          link: "https://example.com",
          actionType: "redirect",
          actionLabel: "View",
          isPinned: true,
          isDeleted: false,
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-01T00:00:00Z",
        },
      ],
      meta: { total: 1, offset: 0, limit: 10, page: 1 },
      isLoading: false,
      error: undefined,
    } as never);

    await renderWithParams(AdminShopView);
    const unpinButton = screen.getByRole("button", { name: /unpin product “test item”/i });
    expect(unpinButton.getAttribute("aria-pressed")).toBe("true");

    await act(async () => {
      fireEvent.click(unpinButton);
    });
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.getByRole("alert").textContent).toContain("Failed to update pin");
  });

  it("shows the product load error for an unavailable edit target", () => {
    mocks.useAdminProduct.mockReturnValue({
      product: undefined,
      error: new Error("missing"),
      isLoading: false,
    } as never);
    render(<AdminProductFormView id="missing" />);
    expect(screen.getByRole("alert").textContent).toMatch(/couldn.t be loaded/i);
    mocks.useAdminProduct.mockReturnValue({
      product: undefined,
      error: undefined,
      isLoading: false,
    } as never);
  });

  it("submits login credentials and displays an authentication failure", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    render(<LoginView />);
    fireEvent.change(screen.getByLabelText("Username"), { target: { value: "person" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrong" } });
    await act(async () =>
      fireEvent.submit(screen.getByRole("button", { name: /sign in/i }).closest("form")!)
    );
    expect(await screen.findByText("Invalid username or password")).toBeTruthy();
    log.mockRestore();
  });

  it("renders the admin posts listing and applies URL filters", async () => {
    await renderWithParams(PostsListView);
    expect(mocks.useAdminPosts).toHaveBeenCalledWith(
      expect.objectContaining({ status: "PUBLISHED", limit: 10 })
    );
  });

  it("renders post creation and edit forms with their metadata sections", () => {
    render(<PostCreateView />);
    expect(screen.getByText("SEO Metadata")).toBeTruthy();
    cleanup();
    render(<PostEditView />);
    expect(screen.getByText("SEO Metadata")).toBeTruthy();
  });

  it("renders the shared admin resource list for the selected resource", () => {
    render(<AdminResourcePage resource="tags" />);
    expect(screen.getByText("tags")).toBeTruthy();
    expect(mocks.useAdminResources).toHaveBeenCalledWith(
      "tag",
      expect.objectContaining({ offset: 0 })
    );
  });

  it("shows the dashboard and records its title in the dashboard context", () => {
    render(<DashboardView />);
    expect(screen.getByText("overview")).toBeTruthy();
    expect(mocks.useDashboard).toHaveBeenCalled();
  });

  it("renders the admin project list and page creation/editor forms", async () => {
    await act(async () => render(<AdminProjectsListView searchParams={Promise.resolve({})} />));
    expect(screen.getByRole("heading", { name: "projects" })).toBeTruthy();
    cleanup();
    render(<ProjectCreateView />);
    expect(screen.getByRole("heading", { name: /create new project/i })).toBeTruthy();
    cleanup();
    render(<ProjectEditView />);
    expect(screen.getByRole("heading", { name: /edit project/i })).toBeTruthy();
  });

  it("renders page list and page create/edit forms", async () => {
    await act(async () => render(<PagesListView searchParams={Promise.resolve({})} />));
    expect(screen.getByRole("heading", { name: "pages" })).toBeTruthy();
    cleanup();
    render(<PageCreateView />);
    expect(screen.getByText(/SEO Metadata/i)).toBeTruthy();
    cleanup();
    render(<PageEditView />);
    expect(screen.getByText(/SEO Metadata/i)).toBeTruthy();
  });

  it("renders the analytics page and its activity section", () => {
    render(<AnalyticsView />);
    expect(screen.getByText("analytics")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "recent activity" })).toBeTruthy();
  });
});
