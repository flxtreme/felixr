import { submitForm } from "@/src/features/admin/forms/services";

export const useSubmitForm = (formId: string) => {
  const submit = async (data: Record<string, unknown>) => {
    return submitForm(formId, { data });
  };

  return { submit };
};

export default useSubmitForm;