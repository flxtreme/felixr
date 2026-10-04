export function SectionDivider() {
  return (
    <div aria-hidden="true" className="mx-auto flex max-w-3xl gap-2 px-6">
      <span className="h-1 w-8 bg-primary" />
      <span className="h-1 w-3 bg-foreground/25" />
    </div>
  );
}
