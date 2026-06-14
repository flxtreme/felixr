import Shimmer from "./Shimmer";

const EditorShimmer = () => (
  <div className="flex flex-col flex-1 h-full p-8 space-y-4">
    <Shimmer className="h-5 w-48" />
    <Shimmer className="h-4 w-full" />
    <Shimmer className="h-4 w-[92%]" />
    <Shimmer className="h-4 w-[85%]" />
    <Shimmer className="h-4 w-full" />
    <Shimmer className="h-4 w-[78%]" />
    <div className="pt-4 space-y-3">
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-4 w-[88%]" />
      <Shimmer className="h-4 w-[95%]" />
      <Shimmer className="h-4 w-[70%]" />
    </div>
    <div className="pt-4 space-y-3">
      <Shimmer className="h-4 w-full" />
      <Shimmer className="h-4 w-[82%]" />
      <Shimmer className="h-4 w-[91%]" />
    </div>
  </div>
);

const SidebarShimmer = () => (
  <div className="p-5 space-y-7">
    <div className="space-y-4">
      <Shimmer className="h-3 w-24" />
      <div className="space-y-2">
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Shimmer className="h-3 w-12" />
        <Shimmer className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Shimmer className="h-3 w-20" />
        <Shimmer className="h-20 w-full" />
      </div>
      <Shimmer className="h-10 w-full" />
    </div>
    <div className="space-y-4">
      <Shimmer className="h-3 w-28" />
      <div className="space-y-2">
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Shimmer className="h-3 w-24" />
        <Shimmer className="h-10 w-full" />
      </div>
    </div>
  </div>
);

export { EditorShimmer, SidebarShimmer };