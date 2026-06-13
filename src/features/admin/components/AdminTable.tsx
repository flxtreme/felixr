"use client";

import React from "react";
import { cln } from "@/src/utils/cln";
import { NoItemsFound } from "./NoItemsFound";

export interface Column<T> {
  header: string;
  cell: (item: T) => React.ReactNode;
  className?: string;
  skeletonWidth?: string;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  skeletonCount?: number;
}

export function AdminTable<T>({
  columns,
  data,
  isLoading,
  emptyMessage = "No items found.",
  skeletonCount = 5,
}: AdminTableProps<T>) {
  if (isLoading) {
    return (
      <div className="bg-surface shadow-sm rounded-lg overflow-hidden">
        <div className="bg-muted h-10 w-full border-b border-border" />
        <div className="divide-y divide-border">
          {[...Array(skeletonCount)].map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
              {columns.map((col, j) => (
                <div
                  key={j}
                  className={cln(
                    "h-4 bg-muted rounded",
                    col.skeletonWidth || "w-32",
                    j === columns.length - 1 && "ml-auto"
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return <NoItemsFound message={emptyMessage} />;
  }

  return (
    <div className="bg-surface shadow-sm rounded-lg overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-border bg-muted">
            {columns.map((col, i) => (
              <th
                key={i}
                className={cln(
                  "px-6 py-3 text-[10px] font-mono font-bold uppercase tracking-wider text-foreground/40",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((item, i) => (
            <tr key={i} className="group transition-colors hover:bg-muted/50">
              {columns.map((col, j) => (
                <td key={j} className={cln("px-6 py-4 align-middle", col.className)}>
                  {col.cell(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
