import useSWR from "swr";

import { getForm } from "@/src/features/admin/forms/services";

export const useForm = (id?: string) => {
  const key = id ? ["form", id] : null;

  const swr = useSWR(key, () => getForm(id!), { keepPreviousData: true });

  return {
    ...swr,
    form: swr.data,
    isLoading: swr.isLoading,
  };
};

export default useForm;