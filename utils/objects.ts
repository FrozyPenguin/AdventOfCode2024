export function deepClone<T>(object: T): T {
  if (typeof object !== "object") return object;
  const output: T = (Array.isArray(object) ? [] : {}) as T;

  for (const [key, value] of Object.entries(object as any)) {
    output[key] = deepClone(value);
  }
  return output;
}

export function deepEqual<T>(object1: T, object2: T): boolean {
  if (object1 === object2) return true;

  if (
    object1 === null ||
    object2 === null ||
    typeof object1 !== "object" ||
    typeof object2 !== "object"
  ) {
    return false;
  }

  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }
    if (!deepEqual(object1[key], object2[key])) {
      return false;
    }
  }

  return true;
}
