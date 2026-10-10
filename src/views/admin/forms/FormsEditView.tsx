"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm, useFormActions } from "@/src/features/admin/forms/hooks";
import { FormBuilderEditor } from "@/src/features/admin/forms/components/FormBuilderEditor";

interface FormsEditViewProps {
  params: Promise<{ id?: string }>;
}

export default function FormsEditView({ params }: FormsEditViewProps) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const formId = resolvedParams?.id;

  const { form, isLoading } = useForm(formId);
  const { update } = useFormActions();

  if (isLoading) {
    return <div className="p-6 text-center text-foreground/50">Loading form builder...</div>;
  }

  if (!form && formId) {
    return <div className="p-6 text-center text-foreground/50">Form not found</div>;
  }

  const handleSave = async (payload: any) => {
    if (formId) {
      await update(formId, payload);
      router.push("/admin/forms");
    }
  };

  const handleAutoSaveConfig = async (config: any) => {
    if (formId) {
      await update(formId, { config }, true);
    }
  };

  return (
    <FormBuilderEditor
      formId={formId}
      isEdit={true}
      form={form}
      onSave={handleSave}
      onAutoSaveConfig={handleAutoSaveConfig}
      title="Edit Form"
      description="Modify your existing form configuration"
    />
  );
}
