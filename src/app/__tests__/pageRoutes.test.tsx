import { describe, expect, it, vi } from "vitest";
import type { ReactElement } from "react";
import AdminRoot from "@/src/app/admin/page";
import AdminUsersPage from "@/src/app/admin/users/page";
import AdminUploadsPage from "@/src/app/admin/uploads/page";
import AdminTrainingsPage from "@/src/app/admin/trainings/page";
import AdminAnalyticsPage from "@/src/app/admin/analytics/page";
import AdminTagsPage from "@/src/app/admin/tags/page";
import AdminStacksPage from "@/src/app/admin/stacks/page";
import AdminGigsPage from "@/src/app/admin/gigs/page";
import AdminExperiencePage from "@/src/app/admin/experience/page";
import AdminShopPage from "@/src/app/admin/shop/page";
import AdminCertificationsPage from "@/src/app/admin/certifications/page";
import AdminDashboardPage from "@/src/app/admin/dashboard/page";
import AdminPagesPage from "@/src/app/admin/pages/page";
import AdminPageCreatePage from "@/src/app/admin/pages/new/page";
import AdminPageEditPage from "@/src/app/admin/pages/[id]/page";
import AdminPostsPage from "@/src/app/admin/posts/page";
import AdminPostCreatePage from "@/src/app/admin/posts/new/page";
import AdminPostEditPage from "@/src/app/admin/posts/[id]/page";
import AdminProjectsPage from "@/src/app/admin/projects/page";
import AdminProjectCreatePage from "@/src/app/admin/projects/new/page";
import AdminProjectEditPage from "@/src/app/admin/projects/[id]/page";
import LoginPage from "@/src/app/login/page";
import HomeRoute from "@/src/app/(public)/page";
import HomePage from "@/src/app/(public)/home/page";
import BlogListPage from "@/src/app/(public)/blog/page";
import BlogPostPage from "@/src/app/(public)/blog/[slug]/page";
import CustomPage from "@/src/app/(public)/[slug]/page";
import ProjectsListPage from "@/src/app/(public)/projects/page";
import ProjectDetailPage from "@/src/app/(public)/projects/[slug]/page";
import TrainingsPage from "@/src/app/(public)/trainings/page";
import GigsPage from "@/src/app/(public)/gigs/page";
import StackPage from "@/src/app/(public)/stack/page";
import ExperiencePage from "@/src/app/(public)/experience/page";
import ShopPage from "@/src/app/(public)/shop/page";
import CertificationsPage from "@/src/app/(public)/certifications/page";
import AdminResourcePage from "@/src/views/admin/resources/AdminResourcePage";
import AdminUploadsView from "@/src/views/admin/uploads/AdminUploadsView";
import AdminShopView from "@/src/views/admin/shop/AdminShopView";
import DashboardView from "@/src/views/admin/DashboardView";
import PagesListView from "@/src/views/admin/pages/PagesListView";
import PageCreateView from "@/src/views/admin/pages/PageCreateView";
import PageEditView from "@/src/views/admin/pages/PageEditView";
import PostsListView from "@/src/views/admin/posts/PostsListView";
import PostCreateView from "@/src/views/admin/posts/PostCreateView";
import PostEditView from "@/src/views/admin/posts/PostEditView";
import ProjectsListAdminView from "@/src/views/admin/projects/ProjectsListView";
import ProjectCreateView from "@/src/views/admin/projects/ProjectCreateView";
import ProjectEditView from "@/src/views/admin/projects/ProjectEditView";
import AnalyticsView from "@/src/views/admin/analytics/AnalyticsView";
import LoginView from "@/src/views/auth/LoginView";
import HomeView from "@/src/views/home/HomeView";
import BlogListView from "@/src/views/blog/BlogListView";
import BlogPostView from "@/src/views/blog/BlogPostView";
import CustomPageView from "@/src/views/pages/CustomPageView";
import ProjectsListView from "@/src/views/projects/ProjectsListView";
import ProjectDetailView from "@/src/views/projects/ProjectDetailView";
import TrainingsView from "@/src/views/trainings/TrainingsView";
import GigsView from "@/src/views/gigs/GigsView";
import StackView from "@/src/views/stack/StackView";
import ExperienceView from "@/src/views/experience/ExperienceView";
import ShopView from "@/src/views/shop/ShopView";
import CertificationsView from "@/src/views/certifications/CertificationsView";
import { redirect } from "next/navigation";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() })),
  useParams: vi.fn(() => ({})),
}));
vi.mock("server-only", () => ({}));

const forwardedPages: Array<[string, unknown, unknown]> = [
  ["admin dashboard", AdminDashboardPage, DashboardView],
  ["admin pages list", AdminPagesPage, PagesListView],
  ["admin page creation", AdminPageCreatePage, PageCreateView],
  ["admin page editing", AdminPageEditPage, PageEditView],
  ["admin posts list", AdminPostsPage, PostsListView],
  ["admin post creation", AdminPostCreatePage, PostCreateView],
  ["admin post editing", AdminPostEditPage, PostEditView],
  ["admin projects list", AdminProjectsPage, ProjectsListAdminView],
  ["admin project creation", AdminProjectCreatePage, ProjectCreateView],
  ["public home root", HomeRoute, HomePage],
  ["public home", HomePage, HomeView],
  ["public blog list", BlogListPage, BlogListView],
  ["public blog detail", BlogPostPage, BlogPostView],
  ["public custom page", CustomPage, CustomPageView],
  ["public project list", ProjectsListPage, ProjectsListView],
  ["public project detail", ProjectDetailPage, ProjectDetailView],
  ["public trainings", TrainingsPage, TrainingsView],
  ["public gigs", GigsPage, GigsView],
  ["public stack", StackPage, StackView],
  ["public experience", ExperiencePage, ExperienceView],
  ["public shop", ShopPage, ShopView],
  ["public certifications", CertificationsPage, CertificationsView],
];

describe("App Router page forwarding", () => {
  it.each(forwardedPages)("%s resolves to its assigned view", (_name, page, view) => {
    expect(page).toBe(view);
  });

  it("redirects the admin root to the dashboard", () => {
    AdminRoot();
    expect(redirect).toHaveBeenCalledWith("/admin/dashboard");
  });

  it.each([
    ["users", AdminUsersPage, "users"],
    ["trainings", AdminTrainingsPage, "trainings"],
    ["tags", AdminTagsPage, "tags"],
    ["stacks", AdminStacksPage, "stacks"],
    ["gigs", AdminGigsPage, "gigs"],
    ["experience", AdminExperiencePage, "experience"],
    ["certifications", AdminCertificationsPage, "certifications"],
  ])("configures the shared admin resource page for %s", (_name, page, resource) => {
    const tree = (page as () => ReactElement)();
    const resourceElement = (tree.props as { children: ReactElement<{ resource: string }> })
      .children;
    expect(resourceElement.type).toBe(AdminResourcePage);
    expect(resourceElement.props.resource).toBe(resource);
  });

  it("passes uploads search parameters through to the uploads view", () => {
    const searchParams = Promise.resolve({ search: "images" });
    const element = AdminUploadsPage({ searchParams });
    expect(element.type).toBe(AdminUploadsView);
    expect((element.props as { searchParams: typeof searchParams }).searchParams).toBe(
      searchParams
    );
  });

  it("passes shop search and status parameters through to the shop view", () => {
    const searchParams = Promise.resolve({ search: "templates", status: "published" });
    const element = AdminShopPage({ searchParams });
    expect(element.type).toBe(AdminShopView);
    expect((element.props as { searchParams: typeof searchParams }).searchParams).toBe(
      searchParams
    );
  });

  it.each([
    ["admin project editing", AdminProjectEditPage, ProjectEditView],
    ["admin analytics", AdminAnalyticsPage, AnalyticsView],
    ["login", LoginPage, LoginView],
  ])("renders the %s view through its wrapper", (_name, page, view) => {
    const element = (page as () => ReactElement)();
    expect(element.type).toBe(view);
  });
});
