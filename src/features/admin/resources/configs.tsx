import { ReactNode } from "react";
import { AdminResourceField } from "../components/AdminResourceForm";
import { AdminResourceEndpoint, AdminResourceRecord } from "./types";
import { WidgetRegistry } from "../components/WidgetRegistry";

export type ResourceKey = "users" | "gigs" | "experience" | "trainings" | "certifications" | "stacks" | "tags";
export type ResourceRecord = AdminResourceRecord;
export type ResourceConfig = {
    title: string;
    singular: string;
    description: string;
    endpoint: AdminResourceEndpoint;
    fields: AdminResourceField[];
    columns: { label: string; key: string; format?: (value: unknown, record: ResourceRecord) => ReactNode }[];
    rightPanel?: ReactNode;
};

export function displayCell(value: unknown) {
    if (value === null || value === undefined || value === "") return "—";
    if (Array.isArray(value)) return value.join(", ") || "—";
    return String(value);
}

export const configs: Record<ResourceKey, ResourceConfig> = {
    users: {
        title: "users",
        singular: "user",
        description: "Manage admin accounts and access roles.",
        endpoint: "user",
        fields: [
            { name: "email", label: "Email", type: "email", required: true },
            { name: "username", label: "Username", required: true },
            { name: "password", label: "Password", type: "password", requiredOnCreate: true },
            { name: "name", label: "Name" },
            { name: "phone", label: "Phone" },
            { name: "avatar", label: "Avatar URL", type: "url" },
            { name: "roles", label: "Roles", type: "list", placeholder: "One role per line" },
        ],
        columns: [
            {
                label: "Name",
                key: "name",
                format: (_, record) => (
                    <div className="flex min-w-0 flex-col gap-1" >
                        <span className="text-sm font-bold text-foreground/80"> {displayCell(record.name)} </span>
                        < span className="truncate text-xs text-foreground/45" >
                            {displayCell(record.username)} <span aria-hidden="true" >| </span> {displayCell(record.email)}
                        </span>
                    </div>
                ),
            },
            { label: "Roles", key: "roles", format: (value) => Array.isArray(value) ? value.join(", ") || "—" : "—" },
        ],
        rightPanel: <WidgetRegistry includes={[
            "quick-create"
        ]} />
    },
    gigs: {
        title: "gigs",
        singular: "gig",
        description: "Manage services and their public calls to action.",
        endpoint: "gig",
        fields: [
            { name: "title", label: "Title", required: true },
            { name: "description", label: "Description", type: "textarea", required: true },
            { name: "details", label: "Details", type: "list" },
            { name: "link", label: "Link", type: "url", required: true },
            { name: "linkLabel", label: "Link label", required: true },
            { name: "external", label: "External link", type: "boolean" },
        ],
        columns: [
            { label: "Title", key: "title" },
        ],
        rightPanel: <WidgetRegistry includes={[
            "quick-create"
        ]} />
    },
    experience: {
        title: "experience",
        singular: "experience",
        description: "Manage roles, companies, and responsibilities.",
        endpoint: "experience",
        fields: [
            { name: "role", label: "Role", required: true },
            { name: "company", label: "Company", required: true },
            { name: "start", label: "Start", required: true },
            { name: "end", label: "End", required: true },
            { name: "responsibilities", label: "Responsibilities", type: "list" },
        ],
        columns: [
            { label: "Role", key: "role" },
            { label: "Company", key: "company" },
            { label: "Start", key: "start" },
            { label: "End", key: "end" },
        ],
        rightPanel: <WidgetRegistry includes={[
            "quick-create"
        ]} />
    },
    trainings: {
        title: "trainings",
        singular: "training",
        description: "Manage courses, providers, and completion details.",
        endpoint: "training",
        fields: [
            { name: "title", label: "Title", required: true },
            { name: "provider", label: "Provider", required: true },
            { name: "completedAt", label: "Completed at", required: true },
            { name: "description", label: "Description", type: "textarea", required: true },
        ],
        columns: [
            { label: "Title", key: "title" },
            { label: "Provider", key: "provider" },
            { label: "Completed", key: "completedAt" },
            { label: "Description", key: "description" },
        ],
        rightPanel: <WidgetRegistry includes={[
            "quick-create"
        ]} />
    },
    certifications: {
        title: "certifications",
        singular: "certification",
        description: "Manage certificates and optional credential links.",
        endpoint: "certification",
        fields: [
            { name: "title", label: "Title", required: true },
            { name: "issuer", label: "Issuer", required: true },
            { name: "issuedAt", label: "Issued at", required: true },
            { name: "description", label: "Description", type: "textarea", required: true },
            { name: "credentialId", label: "Credential ID" },
            { name: "credentialUrl", label: "Credential URL", type: "url" },
        ],
        columns: [
            { label: "Title", key: "title" },
            { label: "Issuer", key: "issuer" },
            { label: "Issued", key: "issuedAt" },
            { label: "Credential ID", key: "credentialId" },
        ],
        rightPanel: <WidgetRegistry includes={[
            "quick-create"
        ]} />
    },
    stacks: {
        title: "stacks",
        singular: "stack",
        description: "Manage the technologies and tools shown on your public profile.",
        endpoint: "stack",
        fields: [
            { name: "label", label: "Label", required: true },
            { name: "key", label: "Key", required: true },
            { name: "color", label: "Color", required: true },
            { name: "category", label: "Category", required: true },
        ],
        columns: [
            { label: "Category", key: "category" },
        ],
        rightPanel: <WidgetRegistry includes={[
            "quick-create"
        ]} />
    },
    tags: {
        title: "tags",
        singular: "tag",
        description: "Manage content classification and keywords.",
        endpoint: "tag",
        fields: [
            { name: "name", label: "Name", required: true },
            { name: "slug", label: "Slug", required: true },
            { name: "excludeFromPages", label: "Exclude from pages", type: "boolean" },
        ],
        columns: [
            { label: "Name", key: "name" },
        ],
        rightPanel: <WidgetRegistry includes={[
            "quick-create"
        ]} />
    },
};