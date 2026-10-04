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

// Matches the six-card featured project grid in HomeView.
const ProjectCardShimmer = () => {
  return (
    <div className="flex min-h-56 flex-col justify-between border border-border p-5">
      <div>
        <div className="mb-8 flex items-center justify-between">
          <Shimmer className="h-3 w-14" />
          <Shimmer className="size-4" />
        </div>
        <Shimmer className="h-6 w-3/4" />
        <div className="mt-2 space-y-2">
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-5/6" />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <Shimmer className="h-3 w-12" />
        <Shimmer className="h-3 w-14" />
      </div>
    </div>
  );
};

export { PostShimmer, ProjectCardShimmer };
