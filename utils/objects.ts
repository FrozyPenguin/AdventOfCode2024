export function deepClone<T>(object: T): T {
  if (typeof object !== "object") return object;
  const output: T = (Array.isArray(object) ? [] : {}) as T;

  for (const [key, value] of Object.entries(object as any)) {
    output[key] = deepClone(value);
  }
  return output;
}
