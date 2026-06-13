"use client";

import { useEffect } from "react";
import { useModal } from "@/src/contexts/ModalContext";
import errorEmitter from "@/src/utils/errorEmitter";

export const GlobalErrorHandler = () => {
  const { showModal } = useModal();

  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      showModal({
        type: "error",
        title: "Runtime Error",
        message: e.error?.message || e.message || "An unexpected error occurred.",
        confirmLabel: "Dismiss",
      });
    };

    const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
      showModal({
        type: "error",
        title: "Unhandled Error",
        message:
          e.reason instanceof Error
            ? e.reason.message
            : String(e.reason) || "An unhandled promise rejection occurred.",
        confirmLabel: "Dismiss",
      });
    };

    // Fetcher errors
    errorEmitter.register((error) => {
      showModal({
        type: "error",
        title: "Request Failed",
        message: error.message,
        confirmLabel: "Dismiss",
      });
    });

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      errorEmitter.unregister();
    };
  }, [showModal]);

  return null;
};