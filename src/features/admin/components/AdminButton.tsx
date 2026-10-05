import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cln } from "@/src/utils/cln";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
type Size = "xs" | "sm" | "md" | "lg" | "xl" | "icon";

export type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
};

const base =
  "inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap font-mono font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50 aria-busy:cursor-progress";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary/85 active:bg-primary/75",
  secondary: "bg-foreground/10 text-foreground hover:bg-foreground/15 active:bg-foreground/20",
  outline:
    "border border-foreground/15 bg-transparent text-foreground hover:border-primary/50 hover:bg-surface/45 active:bg-surface/70",
  ghost: "bg-transparent text-foreground hover:bg-surface/45 active:bg-surface/70",
  destructive: "bg-red-500 text-white hover:bg-red-500/85 active:bg-red-500/75 focus-visible:outline-red-500",
  link: "h-auto bg-transparent p-0 text-primary underline-offset-4 hover:underline",
};

const sizes: Record<Size, string> = {
  xs: "h-7 px-2 text-xs",
  sm: "h-8 px-3 text-sm",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-5 text-base",
  xl: "h-12 px-6 text-base",
  icon: "size-8 p-0 text-sm",
};

export const AdminButton = forwardRef<HTMLButtonElement, AdminButtonProps>(
  function AdminButton(
    {
      variant = "outline",
      size = "sm",
      loading = false,
      fullWidth = false,
      disabled,
      type = "button",
      className,
      children,
      ...props
    },
    ref,
  ) {

    return (
      <button
        {...props}
        ref={ref}
        type={type}
        data-size={size}
        data-variant={variant}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        className={cln(
          base,
          variants[variant],
          variant !== "link" && sizes[size],
          fullWidth && "w-full",
          className,
        )}
      >
        {children}
      </button>
    );
  },
);