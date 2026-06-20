import Shimmer from "./Shimmer";

export interface PostShimmerProps {
  count?: number;
}

// Matches the divide-y post list in HomeView
const PostShimmer = ({ count = 3 }: PostShimmerProps) => {
  return (
    <div className="flex flex-col divide-y divide-border">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="py-6 first:pt-0 last:pb-0 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <Shimmer className="h-4 w-2/3" />
            <Shimmer className="h-4 w-4 shrink-0" />
          </div>
          <Shimmer className="h-3.5 w-full" />
          <Shimmer className="h-3.5 w-4/5" />
          <Shimmer className="h-3 w-24 mt-0.5" />
        </div>
      ))}
    </div>
  );
};

// Matches the bordered card grid in HomeView (3-col with image carousel)
const ProjectCardShimmer = () => {
  return (
    <div className="p-4 border-l-6 border-primary/20 bg-primary/5 space-y-2 min-h-[173.5]">
      <Shimmer className="h-5 w-40 mb-4" />
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-4 w-1/2" />
      <Shimmer className="h-3 w-30" />
      <div className="flex items-center gap-2 mt-3">
        <Shimmer className="size-8 rounded" />
        <Shimmer className="size-8 rounded" />
      </div>
    </div>
  );
};

export { PostShimmer, ProjectCardShimmer };