"use client";

import React from "react";
import { Skeleton } from "flxtheme";
import { cln } from "@/src/utils/cln";

export interface AdminListColumn<T> {
  header: string;
  cell: (item: T) => React.ReactNode;
  className?: string;
  skeletonWidth?: string;
}

export function AdminList<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No items found.",
  skeletonCount = 5,
}: {
  columns: AdminListColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  skeletonCount?: number;
}) {
  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-3xl divide-y divide-foreground/10 border-b border-foreground/10">
        {Array.from({ length: skeletonCount }, (_, index) => (
          <div key={index} className="grid gap-4 py-5 sm:grid-cols-2 lg:flex lg:items-center">
            {columns.map((column) => (
              <div key={column.header} className={cln("min-w-0 flex-1", columns.length === 1 && "sm:col-span-full")}>
                <Skeleton variant="text" className={cln(column.skeletonWidth || "w-32")} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <p className="mx-auto w-full max-w-3xl border-b border-foreground/10 py-12 text-center text-sm text-foreground/45">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="mx-auto w-full max-w-3xl divide-y divide-foreground/10 border-b border-foreground/10">
      {data.map((item, index) => (
        <li key={index} className="grid gap-4 py-5 sm:grid-cols-2 lg:flex lg:items-center lg:gap-6">
          {columns.map((column, columnIndex) => (
            <div
              key={column.header}
              className={cln(
                "min-w-0",
                columns.length === 1 && "sm:col-span-full",
                columnIndex === 0 && "lg:flex-1",
                column.className?.includes("text-right") && "lg:text-right"
              )}
            >
              <div className="min-w-0">{column.cell(item)}</div>
            </div>
          ))}
        </li>
      ))}
    </ul>
  );
}
