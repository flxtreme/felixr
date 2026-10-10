"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useFormActions } from "@/src/features/admin/forms/hooks";
import { FormBuilderEditor } from "@/src/features/admin/forms/components/FormBuilderEditor";

export default function FormsCreateView() {
  const router = useRouter();
  const { create } = useFormActions();

  const handleSave = async (payload: any) => {
    const newForm = await create(payload);
    router.push(`/admin/forms/${newForm.id}`);
  };

  return (
    <FormBuilderEditor
      isEdit={false}
      onSave={handleSave}
      title="Create New Form"
      description="Build and configure your new form visually"
    />
  );
}
