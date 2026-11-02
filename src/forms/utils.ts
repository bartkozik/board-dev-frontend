export const initializeChecklist = (checklistKeys: string[]): Record<string, boolean> => {
  return checklistKeys.reduce((acc, key) => {
    acc[key] = false;
    return acc;
  }, {} as Record<string, boolean>);
};
