import type { Stack } from "@/src/features/public/stack/types";

export type TechStackCategory = {
  label: string;
  items: Stack[];
};

export const techStackCategoryAnchor = (category: string) =>
  category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const categoryRank = (category: string) => {
  const normalized = category.trim().toLowerCase();
  if (normalized.includes("frontend")) return 0;
  if (normalized.includes("backend")) return 1;
  if (normalized.includes("devops")) return 2;
  if (normalized.startsWith("ai") || normalized.includes("agentic")) return 3;
  if (normalized.startsWith("tool") || normalized.includes("design")) return 4;
  return 5;
};

export const groupStacksByCategory = (stacks: Stack[]): TechStackCategory[] => {
  const groups = new Map<string, Stack[]>();

  for (const stack of stacks) {
    const items = groups.get(stack.category) ?? [];
    items.push(stack);
    groups.set(stack.category, items);
  }

  return Array.from(groups, ([label, items]) => ({ label, items })).sort(
    (a, b) => categoryRank(a.label) - categoryRank(b.label),
  );
};
