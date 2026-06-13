export const trimContent = (content: string) => {
  return content
    .replace(/[#*_`>\-\[\]\(\)!]/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 160);
};
