import Shimmer from "./Shimmer";

export interface PostShimmerProps {
  count?: number;
}

const PostShimmer = ( props: PostShimmerProps ) => {
  const { count = 3 } = props;
  
  return(
    <div className="flex flex-col gap-10">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <Shimmer className="h-3.5 w-24" />
          <Shimmer className="h-5 w-2/3 mt-0.5" />
          <Shimmer className="h-3.5 w-full mt-1" />
          <Shimmer className="h-3.5 w-4/5" />
          <Shimmer className="h-3.5 w-1/2" />
        </div>
      ))}
    </div>
  )
}

export { PostShimmer }