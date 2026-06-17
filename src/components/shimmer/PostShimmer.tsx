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
const ProjectShimmer = ({ count = 6 }: PostShimmerProps) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="rounded-xl border border-border overflow-hidden flex flex-col gap-0">
          {/* Image placeholder matching aspect-video */}
          <Shimmer className="w-full aspect-video rounded-none" />
          <div className="flex flex-col gap-2 px-5 pb-4 pt-3">
            <Shimmer className="h-4 w-2/3" />
            <Shimmer className="h-3.5 w-full" />
            <Shimmer className="h-3.5 w-4/5" />
            <Shimmer className="h-3 w-24 mt-0.5" />
          </div>
        </div>
      ))}
    </>
  );
};

export { PostShimmer, ProjectShimmer };