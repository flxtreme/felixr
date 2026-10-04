export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-foreground/10 border-dashed">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 p-6">
        <span className="text-lg font-bold text-primary">felixr</span>
        <p className="text-sm text-foreground/50">
          © {new Date().getFullYear()} felixr
        </p>
      </div>
    </footer>
  );
};

export default Footer;
