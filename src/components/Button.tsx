import React from "react";
import { cln } from "@/src/utils/cln";

export type ButtonSize = "sm" | "md" | "lg";
export type ButtonVariant = "primary" | "secondary" | "outline" | "tertiary";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize; // default md
  variant?: ButtonVariant; // default primary
  square?: boolean; // icon-only square button
  className?: string;
  children: React.ReactNode;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

const squareSizeClasses: Record<ButtonSize, string> = {
  sm: "size-8 p-1.5 text-xs",
  md: "size-10 p-2 text-sm",
  lg: "size-12 p-3 text-base",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white border border-primary hover:bg-primary/90",
  secondary: "bg-secondary text-white border border-secondary hover:bg-secondary/90",
  outline: "bg-transparent text-foreground border border-foreground hover:bg-foreground/10",
  tertiary: "bg-foreground/5 text-foreground/60 border border-foreground/20 hover:bg-foreground/10 hover:text-foreground shadow-xs",
};

export const Button: React.FC<ButtonProps> = ({
  size = "md",
  variant = "primary",
  square = false,
  className = "",
  children,
  ...rest
}) => {
  return (
    <button
      className={cln(
        "rounded-md transition-colors flex items-center justify-center",
        square ? squareSizeClasses[size] : sizeClasses[size],
        variantClasses[variant],
        "cursor-pointer",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
