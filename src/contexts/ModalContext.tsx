"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AlertCircle, AlertTriangle, Info, CheckCircle, X } from "lucide-react";

interface ModalOptions {
  title?: string;
  message: string;
  type?: "error" | "warning" | "info" | "success";
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface ModalContextType {
  showModal: (options: ModalOptions) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const typeConfig = {
  error: {
    icon: AlertCircle,
    iconClass: "text-red-500",
    iconBg: "bg-red-500/10",
    title: "text-red-500",
    confirm: "bg-red-500 hover:bg-red-600",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-yellow-500",
    iconBg: "bg-yellow-500/10",
    title: "text-yellow-500",
    confirm: "bg-yellow-500 hover:bg-yellow-600",
  },
  info: {
    icon: Info,
    iconClass: "text-primary",
    iconBg: "bg-primary/10",
    title: "text-primary",
    confirm: "bg-primary hover:bg-primary-hover",
  },
  success: {
    icon: CheckCircle,
    iconClass: "text-green-500",
    iconBg: "bg-green-500/10",
    title: "text-green-500",
    confirm: "bg-green-500 hover:bg-green-600",
  },
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ModalOptions | null>(null);

  const showModal = useCallback((options: ModalOptions) => {
    setModal(options);
  }, []);

  const hideModal = useCallback(() => {
    setModal(null);
  }, []);

  const config = typeConfig[modal?.type ?? "info"];
  const Icon = config.icon;

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={hideModal}
        >
          <div
            className="bg-surface border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${config.iconBg}`}
                >
                  <Icon className={`w-4 h-4 ${config.iconClass}`} />
                </span>
                {modal.title && (
                  <h2 className={`text-base font-semibold ${config.title}`}>
                    {modal.title}
                  </h2>
                )}
              </div>
              <button
                onClick={hideModal}
                className="text-foreground/30 hover:text-foreground transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message */}
            <p className="text-sm text-foreground/50 font-mono leading-relaxed">
              {modal.message}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-1">
              {modal.onConfirm && (
                <button
                  onClick={hideModal}
                  className="px-4 py-2 text-xs font-mono font-semibold border border-border rounded text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors"
                >
                  {modal.cancelLabel ?? "Cancel"}
                </button>
              )}
              <button
                onClick={() => {
                  modal.onConfirm?.();
                  hideModal();
                }}
                className={`px-4 py-2 text-xs font-mono font-semibold text-white rounded transition-colors ${config.confirm}`}
              >
                {modal.confirmLabel ?? (modal.onConfirm ? "Confirm" : "Dismiss")}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within a ModalProvider");
  return context;
};