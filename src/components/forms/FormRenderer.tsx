"use client";

import { AutocompleteField, FieldShell, NumberField, SelectField, TextField } from "@/src/components/forms/fields";
import { AdminButton } from "@/src/features/admin/components/AdminButton";
import { useForm, useSubmitForm } from "@/src/features/admin/forms/hooks";
import type { FormConfig } from "@/src/features/admin/forms/types";
import { cln } from "@/src/utils/cln";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const fieldRegistry: Record<string, React.ComponentType<any>> = {
  text: TextField,
  number: NumberField,
  select: SelectField,
  autocomplete: AutocompleteField,
};

interface FormRendererProps {
  formId: string;
  onSubmitSuccess?: (data: Record<string, unknown>) => void;
  onSubmitError?: (error: string) => void;
  className?: string;
}

export function FormRenderer({ formId, onSubmitSuccess, onSubmitError, className }: FormRendererProps) {
  const { form, isLoading, error: formError } = useForm(formId);
  const { submit } = useSubmitForm(formId);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Initialize form data with default values
  useEffect(() => {
    if (form?.config?.fields) {
      const defaults: Record<string, unknown> = {};
      form.config.fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          defaults[field.name || field.id] = field.defaultValue;
        }
      });
      setFormData(defaults);
    }
  }, [form]);

  const handleChange = (fieldId: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form?.config) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Prepare submission data using field names or IDs
      const submissionData: Record<string, unknown> = {};
      form.config.fields.forEach((field) => {
        const key = field.name || field.id;
        submissionData[key] = formData[key];
      });

      await submit(submissionData);
      setSubmitSuccess(true);
      setFormData({}); // Reset form
      onSubmitSuccess?.(submissionData);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to submit form. Please try again.";
      setSubmitError(errorMessage);
      onSubmitError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={cln("flex items-center justify-center p-8", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (formError || !form) {
    return (
      <div className={cln("p-4 text-red-500", className)}>
        Failed to load form: {formError?.message || "Form not found"}
      </div>
    );
  }

  if (!form.config) {
    return (
      <div className={cln("p-4 text-foreground/50", className)}>
        Form configuration not found.
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className={cln("p-6 text-center bg-green-50/50 border border-green-200 rounded-lg", className)}>
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800 mb-2">Form Submitted Successfully!</h3>
        <p className="text-green-600 mb-4">Thank you for your submission.</p>
        <AdminButton variant="outline" onClick={() => setSubmitSuccess(false)} className="w-auto">
          Submit Another Response
        </AdminButton>
      </div>
    );
  }

  const config = form.config as FormConfig;

  return (
    <form onSubmit={handleSubmit} className={cln("space-y-6", className)} noValidate>
      {config.fields.map((field) => {
        const Cmp = fieldRegistry[field.type];
        const key = field.name || field.id;

        if (!Cmp) {
          return (
            <FieldShell key={field.id} field={field}>
              <div className="rounded border border-dashed border-amber-400 bg-amber-50/50 px-3 py-2 text-sm text-amber-800">
                No component registered for field type "{field.type}"
              </div>
            </FieldShell>
          );
        }

        return (
          <Cmp
            key={field.id}
            field={field}
            value={formData[key]}
            onChange={(value: unknown) => handleChange(key, value)}
            disabled={isSubmitting}
          />
        );
      })}

      {submitError && (
        <div className="flex items-center gap-2 p-3 bg-red-50/50 border border-red-200 rounded-lg text-red-600 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}
    </form>
  );
}

export default FormRenderer;