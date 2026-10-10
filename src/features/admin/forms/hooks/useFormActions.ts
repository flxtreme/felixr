import { mutate } from "swr";

import { createForm, deleteForm, updateForm } from "@/src/features/admin/forms/services";

import type { CreateFormPayload, DeleteFormPayload, Form, UpdateFormPayload } from "@/src/features/admin/forms/types";

export const useFormActions = () => {
  const create = async (payload: CreateFormPayload): Promise<Form> => {
    const form = await createForm(payload);
    await mutate(["forms"], undefined, { revalidate: true });
    return form;
  };

  const update = async (id: string, payload: UpdateFormPayload, silent?: boolean): Promise<Form> => {
    const form = await updateForm(id, payload);
    await mutate(["forms"], undefined, { revalidate: true });
    if (!silent) {
      await mutate(["form", id], undefined, { revalidate: true });
    }
    return form;
  };

  const remove = async (id: string, payload: DeleteFormPayload): Promise<Form> => {
    const form = await deleteForm(id, payload);
    await mutate(["forms"], undefined, { revalidate: true });
    return form;
  };

  return { create, update, remove };
};

export default useFormActions;