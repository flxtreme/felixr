"use client";

import { FiEdit, FiTrash2 } from "flxtheme/icons/fi";
import { IconButton, Modal, useModal } from "flxtheme";
import Link from "next/link";
import { useId } from "react";
import { cln } from "@/src/utils/cln";
import { AdminButton } from "@/src/features/admin/components/AdminButton";

export function AdminRowActions({
  onEdit,
  editHref,
  onDelete,
  isDeleted = false,
  deleteMessage = "Are you sure you want to delete this item?",
}: {
  onEdit?: () => void;
  editHref?: string;
  onDelete: (isPermanent: boolean) => void;
  isDeleted?: boolean;
  deleteMessage?: string;
}) {
  const modalId = `admin-row-delete-${useId()}`;
  const { openModal, closeModal } = useModal();

  return (
    <div className={cln("flex items-center justify-end gap-1")}>
      {editHref ? (
        <Link href={editHref}>
          <IconButton icon={<FiEdit />} aria-label="Edit" variant="ghost" size="sm" />
        </Link>
      ) : (
        <IconButton icon={<FiEdit />} aria-label="Edit" variant="ghost" size="sm" onClick={onEdit} />
      )}
      <IconButton icon={<FiTrash2 />} aria-label="Delete" variant="ghost" size="sm" onClick={() => openModal(modalId)} />
      <Modal
        id={modalId}
        title={isDeleted ? "Permanently delete item?" : "Confirm deletion"}
        size="sm"
        onClose={() => closeModal(modalId)}
        footer={(
          <div className="flex justify-end gap-2">
            <AdminButton type="button" onClick={() => closeModal(modalId)}>Cancel</AdminButton>
            <AdminButton type="button" variant="destructive" onClick={() => { closeModal(modalId); onDelete(isDeleted); }}>
              {isDeleted ? "Delete permanently" : "Delete"}
            </AdminButton>
          </div>
        )}
      >
        <p className="text-sm text-foreground/65">
          {isDeleted
            ? `${deleteMessage} This item is already soft-deleted and will be permanently deleted. This cannot be undone.`
            : deleteMessage}
        </p>
      </Modal>
    </div>
  );
}
