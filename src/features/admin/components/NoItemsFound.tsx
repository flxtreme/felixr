import React from "react";

interface NoItemsFoundProps {
  message: string;
}

export const NoItemsFound = ({ message }: NoItemsFoundProps) => {
  return (
    <div className="flex items-center justify-center py-12 border border-dashed border-border rounded-lg bg-surface shadow-sm">
      <p className="text-sm font-mono text-foreground/40 italic">{message}</p>
    </div>
  );
};
