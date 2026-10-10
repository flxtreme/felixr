"use client";

import { useEffect, useRef, useState } from "react";
import type { FieldOption, OptionsApi } from "@/src/features/admin/forms/types";

function readPath(obj: unknown, path?: string): unknown {
  if (!path) return obj;
  return path
    .split(".")
    .reduce<unknown>(
      (acc, k) =>
        acc !== null && typeof acc === "object"
          ? (acc as Record<string, unknown>)[k]
          : undefined,
      obj
    );
}

function mapOptions(data: unknown, api: OptionsApi): FieldOption[] {
  const list = readPath(data, api.resultsPath);
  if (!Array.isArray(list)) {
    throw new Error(
      api.resultsPath
        ? `No array found at "${api.resultsPath}"`
        : "Response is not an array. Set a results path."
    );
  }
  const lk = api.labelKey || "label";
  const vk = api.valueKey || "value";
  return list
    .map((item): FieldOption => {
      if (item === null || typeof item !== "object") {
        return { label: String(item), value: String(item) };
      }
      const label = readPath(item, lk);
      const value = readPath(item, vk);
      const desc = api.descriptionKey ? readPath(item, api.descriptionKey) : undefined;
      return {
        label: String(label ?? value ?? ""),
        value: String(value ?? label ?? ""),
        ...(desc !== undefined && desc !== null ? { description: String(desc) } : {}),
      };
    })
    .filter((o) => o.value !== "");
}

export async function requestOptions(
  api: OptionsApi,
  query = "",
  signal?: AbortSignal
): Promise<FieldOption[]> {
  const method = api.method ?? "GET";
  const base = typeof window !== "undefined" ? window.location.href : "http://localhost";
  const url = new URL(api.endpoint, base);
  const params: Record<string, string> = { ...(api.params ?? {}) };
  if (api.searchParam && query) params[api.searchParam] = query;
  const headers: Record<string, string> = { Accept: "application/json", ...(api.headers ?? {}) };
  const init: RequestInit = { method, signal, headers };
  if (method === "GET") {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  } else {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(params);
  }
  const res = await fetch(url.toString(), init);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return mapOptions(await res.json(), api);
}

export function useRemoteOptions(
  api: OptionsApi | undefined,
  query: string,
  enabled: boolean
) {
  const [state, setState] = useState<{
    options: FieldOption[];
    loading: boolean;
    error: string | null;
  }>({ options: [], loading: false, error: null });
  const key = api ? JSON.stringify(api) : "";

  useEffect(() => {
    if (!api || !enabled) return;
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    requestOptions(api, query, ctrl.signal)
      .then((options) => setState({ options, loading: false, error: null }))
      .catch((err) => {
        if (ctrl.signal.aborted) return;
        setState({
          options: [],
          loading: false,
          error: err instanceof Error ? err.message : "Failed to load options",
        });
      });
    return () => ctrl.abort();
  }, [key, query, enabled]);

  return state;
}

function nextEnabled(options: FieldOption[], from: number, dir: 1 | -1) {
  if (options.length === 0) return -1;
  let i = from;
  for (let n = 0; n < options.length; n++) {
    i = (i + dir + options.length) % options.length;
    if (!options[i].disabled) return i;
  }
  return -1;
}

function toSelectedArray(current: unknown, multiple: boolean): string[] {
  if (multiple) return Array.isArray(current) ? current.map(String) : [];
  return current !== undefined && current !== null && current !== ""
    ? [String(current)]
    : [];
}

export function useOutsideClose(
  ref: React.RefObject<HTMLElement | null>,
  open: boolean,
  close: () => void
) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, close, ref]);
}

export { nextEnabled, toSelectedArray };