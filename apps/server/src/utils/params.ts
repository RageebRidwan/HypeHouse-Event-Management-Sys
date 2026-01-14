/**
 * Helper to ensure param is a string, not an array
 */
export const asString = (param: string | string[] | undefined): string => {
  if (Array.isArray(param)) {
    return param[0] || "";
  }
  return param || "";
};
