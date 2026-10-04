export type ExperienceItem = {
  role: string;
  company: string;
  start: string;
  end: string;
  responsibilities: string[];
};

export const experienceAnchor = (role: string) =>
  role.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

