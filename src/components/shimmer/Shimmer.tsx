const Shimmer = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-foreground/8 rounded ${className}`} />
);

export default Shimmer;