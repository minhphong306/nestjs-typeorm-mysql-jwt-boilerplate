export const getImageUrlFromJsonArray = (input: string): string[] => {
  if (!input) {
    return [];
  }

  return JSON.parse(input);
};
