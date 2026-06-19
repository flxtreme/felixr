"use client";

import React, { createContext, useContext } from "react";
import { useProjectActions } from "@/src/features/admin/project/hooks";
import { CreateProjectPayload, UpdateProjectPayload } from "@/src/features/admin/project/types";

interface ProjectContextType {
  createProject: (payload: CreateProjectPayload) => Promise<any>;
  updateProject: (id: string, payload: UpdateProjectPayload) => Promise<any>;
  removeProject: (id: string, isPermanent?: boolean) => Promise<any>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const { create, update, remove } = useProjectActions();

  return (
    <ProjectContext.Provider
      value={{
        createProject: create,
        updateProject: update,
        removeProject: (id: string, isPermanent: boolean = false) =>
          remove(id, { isPermanent }),
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
};