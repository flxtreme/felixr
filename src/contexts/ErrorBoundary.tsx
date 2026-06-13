"use client";

import React, { Component, ReactNode } from "react";
import { useModal } from "@/src/contexts/ModalContext";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundaryInner extends Component<Props & { showModal: (o: Parameters<ReturnType<typeof useModal>["showModal"]>[0]) => void }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.showModal({
      type: "error",
      title: "Something went wrong",
      message: error.message || "An unexpected error occurred.",
      confirmLabel: "Dismiss",
    });
    this.setState({ hasError: false });
  }

  render() {
    return this.props.children;
  }
}

export const ErrorBoundary = ({ children }: Props) => {
  const { showModal } = useModal();
  return (
    <ErrorBoundaryInner showModal={showModal}>
      {children}
    </ErrorBoundaryInner>
  );
};