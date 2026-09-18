"use client";

import React, { Component, ReactNode } from "react";
import { useModal, Modal } from "flxtheme";

const ERROR_MODAL_ID = "error-boundary";

interface Props {
  children: ReactNode;
  openModal: (id: string) => void;
}

interface State {
  hasError: boolean;
  message: string;
}

class ErrorBoundaryInner extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || "An unexpected error occurred." };
  }

  componentDidCatch() {
    this.props.openModal(ERROR_MODAL_ID);
  }

  render() {
    return this.props.children;
  }
}

export const ErrorBoundary = ({ children }: { children: ReactNode }) => {
  const { openModal, closeModal } = useModal();
  const [message, setMessage] = React.useState("");

  return (
    <>
      <ErrorBoundaryInner
        openModal={(id) => {
          setMessage("An unexpected error occurred.");
          openModal(id);
        }}
      >
        {children}
      </ErrorBoundaryInner>
      <Modal
        id={ERROR_MODAL_ID}
        title="Something went wrong"
        footer={<button onClick={() => closeModal(ERROR_MODAL_ID)}>Dismiss</button>}
      >
        {message}
      </Modal>
    </>
  );
};