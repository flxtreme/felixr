import React from "react";
import {
  FiSquare,
  FiType,
  FiFileText,
  FiAlignLeft,
  FiMinus,
  FiColumns,
  FiHash,
  FiChevronDown,
  FiSearch,
} from "flxtheme/icons/fi";

export type FormStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type BuiltInFieldType =
  | "button"
  | "title"
  | "text"
  | "paragraph"
  | "divider"
  | "row"
  | "number"
  | "select"
  | "autocomplete";

export type FieldType = BuiltInFieldType | (string & {});

export type Selection = { kind: "field"; id: string } | null;

export interface FieldComponentProps<T extends BaseField = BaseField> {
  field: T;
  value?: unknown;
  onChange?: (value: unknown) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export interface FieldDefinition {
  type: BuiltInFieldType;
  label: string;
  description: string;
  icon: React.ReactNode;
  createDefault: () => BaseField & { type: BuiltInFieldType };
}

export type DragPayload =
  | { kind: "palette"; type: BuiltInFieldType }
  | { kind: "field"; id: string; containerId?: string }
  | null;

export interface FormBuilderProps {
  value?: FormConfig;
  defaultValue?: FormConfig;
  onChange?: (config: FormConfig) => void;
  name?: string;
  slug?: string;
}

export interface FieldOption {
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface BaseField {
  id: string;
  type: FieldType;
  name?: string;
  label?: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  defaultValue?: unknown;
  outerClassName?: string;
  innerClassName?: string;
  metadata?: Record<string, unknown>;
}

export interface ButtonFieldConfig extends BaseField {
  type: "button";
  buttonVariant?: "default" | "primary" | "secondary" | "danger" | "outline" | "ghost";
  buttonType?: "submit" | "reset" | "button";
}

export interface TitleFieldConfig extends BaseField {
  type: "title";
  content?: string;
  textClass?: string;
  containerClass?: string;
}

export interface ParagraphFieldConfig extends BaseField {
  type: "paragraph";
  content?: string;
  textClass?: string;
  containerClass?: string;
}

export interface DividerFieldConfig extends BaseField {
  type: "divider";
  lineStyle?: "solid" | "dashed" | "dotted";
}

export interface RowFieldConfig extends BaseField {
  type: "row";
  layoutType?: "flex" | "grid";
  orientation?: "horizontal" | "vertical";
  columns?: number;
  gap?: string;
  children?: FormField[];
}

export interface TextFieldConfig extends BaseField {
  type: "text";
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface NumberFieldConfig extends BaseField {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

export type OptionsSource = "static" | "api";

export interface OptionsApi {
  endpoint: string;
  method?: "GET" | "POST";
  searchParam?: string;
  params?: Record<string, string>;
  headers?: Record<string, string>;
  resultsPath?: string;
  labelKey?: string;
  valueKey?: string;
  descriptionKey?: string;
}

export interface SelectFieldConfig extends BaseField {
  type: "select";
  optionsSource?: OptionsSource;
  api?: OptionsApi;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  options: FieldOption[];
  maxSelections?: number;
  closeOnSelect?: boolean;
}

export interface AutocompleteFieldConfig extends BaseField {
  type: "autocomplete";
  optionsSource?: OptionsSource;
  api?: OptionsApi;
  multiple?: boolean;
  options?: FieldOption[];
  minSearchLength?: number;
  debounceMs?: number;
  clearable?: boolean;
}

export interface CustomFieldConfig extends BaseField {
  [key: string]: unknown;
}

export type FormField =
  | ButtonFieldConfig
  | TitleFieldConfig
  | ParagraphFieldConfig
  | DividerFieldConfig
  | RowFieldConfig
  | TextFieldConfig
  | NumberFieldConfig
  | SelectFieldConfig
  | AutocompleteFieldConfig
  | CustomFieldConfig;

export interface FormConfig {
  name?: string;
  slug?: string;
  fields: FormField[];
}

export interface Form {
  id: string;
  name: string;
  slug: string;
  config: FormConfig;
  status: FormStatus;
  userId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  deletedBy: string | null;
}

export const builtInFieldDefinitions: FieldDefinition[] = [
  {
    type: "button",
    label: "Button",
    description: "Action button",
    icon: React.createElement(FiSquare, { size: 16 }),
    createDefault: () => ({
      id: `button-${Math.random().toString(36).slice(2, 8)}`,
      type: "button",
      label: "Submit Button",
      buttonVariant: "primary",
      buttonType: "submit",
    }),
  },
  {
    type: "title",
    label: "Title",
    description: "Display heading / title text",
    icon: React.createElement(FiFileText, { size: 16 }),
    createDefault: () => ({
      id: `title-${Math.random().toString(36).slice(2, 8)}`,
      type: "title",
      content: "Section Title",
      textClass: "text-xl font-bold",
      containerClass: "",
    }),
  },
  {
    type: "text",
    label: "Text Input",
    description: "Single-line text input",
    icon: React.createElement(FiType, { size: 16 }),
    createDefault: () => ({
      id: `text-${Math.random().toString(36).slice(2, 8)}`,
      type: "text",
      label: "Text Input",
    }),
  },
  {
    type: "paragraph",
    label: "Paragraph",
    description: "Display paragraph / body text",
    icon: React.createElement(FiAlignLeft, { size: 16 }),
    createDefault: () => ({
      id: `paragraph-${Math.random().toString(36).slice(2, 8)}`,
      type: "paragraph",
      content: "Enter your paragraph text here.",
      textClass: "text-sm text-foreground/80",
      containerClass: "",
    }),
  },
  {
    type: "divider",
    label: "Divider",
    description: "Visual horizontal divider",
    icon: React.createElement(FiMinus, { size: 16 }),
    createDefault: () => ({
      id: `divider-${Math.random().toString(36).slice(2, 8)}`,
      type: "divider",
      lineStyle: "solid",
    }),
  },
  {
    type: "row",
    label: "Row",
    description: "Layout row (flex/grid)",
    icon: React.createElement(FiColumns, { size: 16 }),
    createDefault: () => ({
      id: `row-${Math.random().toString(36).slice(2, 8)}`,
      type: "row",
      label: "Row Layout",
      layoutType: "flex",
      orientation: "horizontal",
      columns: 2,
      children: [],
    }),
  },
  {
    type: "number",
    label: "Number",
    description: "Numeric input",
    icon: React.createElement(FiHash, { size: 16 }),
    createDefault: () => ({
      id: `number-${Math.random().toString(36).slice(2, 8)}`,
      type: "number",
      label: "Number Input",
    }),
  },
  {
    type: "select",
    label: "Select",
    description: "Dropdown option select",
    icon: React.createElement(FiChevronDown, { size: 16 }),
    createDefault: () => ({
      id: `select-${Math.random().toString(36).slice(2, 8)}`,
      type: "select",
      label: "Select Option",
      multiple: false,
      options: [],
    }),
  },
  {
    type: "autocomplete",
    label: "Autocomplete",
    description: "Searchable suggestions",
    icon: React.createElement(FiSearch, { size: 16 }),
    createDefault: () => ({
      id: `autocomplete-${Math.random().toString(36).slice(2, 8)}`,
      type: "autocomplete",
      label: "Autocomplete Search",
    }),
  },
];

export type CreateFormPayload = {
  name: string;
  slug: string;
  status: FormStatus;
  config: FormConfig;
};

export type UpdateFormPayload = Partial<CreateFormPayload>;

export type DeleteFormPayload = {
  isPermanent?: boolean;
};

export type GetFormsQuery = {
  page?: number;
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: FormStatus;
  isActive?: boolean;
};

export type GetFormsResponse = {
  data: Form[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type FormSubmission = {
  id: string;
  formId: string;
  data: Record<string, unknown>;
  userId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
};

export type GetFormSubmissionsQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  formId?: string;
  isActive?: boolean;
  offset?: number;
};

export type GetFormSubmissionsResponse = {
  data: FormSubmission[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};