import { fetcher } from "@/src/utils/fetcher";
import {
  CreateFormPayload,
  DeleteFormPayload,
  Form,
  FormSubmission,
  GetFormSubmissionsQuery,
  GetFormsQuery,
  UpdateFormPayload,
} from "@/src/features/admin/forms/types";
import { PaginatedResponse } from "@/src/common/types";
import { trackAdminMutation } from "@/src/lib/analytics/trackAdminMutation";

const API_PREFIX = "/admin";

const buildQuery = (params?: GetFormsQuery) => {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  if (params.search !== undefined) {
    searchParams.append("search", String(params.search));
  }

  if (params.offset !== undefined) {
    searchParams.append("offset", String(params.offset));
  }

  if (params.limit !== undefined) {
    searchParams.append("limit", String(params.limit));
  }

  if (params.status !== undefined) {
    searchParams.append("status", String(params.status));
  }

  if (params.page !== undefined) {
    searchParams.append("page", String(params.page));
  }

  if (params.isActive !== undefined) {
    searchParams.append("isActive", String(params.isActive));
  }

  return `?${searchParams.toString()}`;
};

const buildSubmissionsQuery = (params?: GetFormSubmissionsQuery) => {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  if (params.search !== undefined) {
    searchParams.append("search", String(params.search));
  }

  if (params.offset !== undefined) {
    searchParams.append("offset", String(params.offset));
  }

  if (params.limit !== undefined) {
    searchParams.append("limit", String(params.limit));
  }

  if (params.formId !== undefined) {
    searchParams.append("formId", String(params.formId));
  }

  if (params.page !== undefined) {
    searchParams.append("page", String(params.page));
  }

  if (params.isActive !== undefined) {
    searchParams.append("isActive", String(params.isActive));
  }

  return `?${searchParams.toString()}`;
};

export const getForms = async (params?: GetFormsQuery): Promise<PaginatedResponse<Form>> => {
  return fetcher(`${API_PREFIX}/forms${buildQuery(params)}`);
};

export const getForm = async (id: string): Promise<Form> => {
  return fetcher(`${API_PREFIX}/forms/${id}`);
};

export const createForm = async (payload: CreateFormPayload): Promise<Form> => {
  return trackAdminMutation({
    action: "insert",
    path: (form) => ["admin", "form", form.id],
    mutate: () =>
      fetcher<Form>(`${API_PREFIX}/forms`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });
};

export const updateForm = async (id: string, payload: UpdateFormPayload): Promise<Form> => {
  return trackAdminMutation({
    action: "update",
    path: ["admin", "form", id],
    getPrevious: () => getForm(id),
    mutate: () =>
      fetcher<Form>(`${API_PREFIX}/forms/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
  });
};

export const deleteForm = async (id: string, payload: DeleteFormPayload): Promise<Form> => {
  return trackAdminMutation({
    action: payload.isPermanent ? "delete" : "soft_delete",
    path: ["admin", "form", id],
    getPrevious: () => getForm(id),
    mutate: () =>
      fetcher<Form>(`${API_PREFIX}/forms/${id}`, {
        method: "DELETE",
        body: JSON.stringify(payload),
      }),
  });
};

export const getFormSubmissions = async (params?: GetFormSubmissionsQuery): Promise<PaginatedResponse<FormSubmission>> => {
  return fetcher(`${API_PREFIX}/submissions${buildSubmissionsQuery(params)}`);
};

export const getFormSubmission = async (id: string): Promise<FormSubmission> => {
  return fetcher(`${API_PREFIX}/submissions/${id}`);
};

export const submitForm = async (formId: string, payload: { data: Record<string, unknown> }): Promise<{ id: string; message: string }> => {
  return fetcher(`${API_PREFIX}/forms/${formId}/submit`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};