"use client";

import { useEffect, useState } from "react";
import { useModal, Modal } from "flxtheme";
import errorEmitter from "@/src/utils/errorEmitter";

const ERROR_MODAL_ID = "global-error";

export const GlobalErrorHandler = () => {
  const { openModal, closeModal } = useModal();
  const [error, setError] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    const show = (title: string, message: string) => {
      setError({ title, message });
      openModal(ERROR_MODAL_ID);
    };

    const handleError = (e: ErrorEvent) => {
      show("Runtime Error", e.error?.message || e.message || "An unexpected error occurred.");
    };

    const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
      show(
        "Unhandled Error",
        e.reason instanceof Error ? e.reason.message : String(e.reason) || "An unhandled promise rejection occurred."
      );
    };

    errorEmitter.register((error) => {
      show("Request Failed", error.message);
    });

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      errorEmitter.unregister();
    };
  }, [openModal]);

  return (
    <Modal
      id={ERROR_MODAL_ID}
      title={error?.title}
      footer={
        <button onClick={() => closeModal(ERROR_MODAL_ID)}>
          Dismiss
        </button>
      }
    >
      {error?.message}
    </Modal>
  );
};