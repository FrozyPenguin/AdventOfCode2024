export function deepClone(object: any) {
  let output: any = null;
  if (Array.isArray(object)) {
    output = [];
  } else if (typeof object === "object") {
    output = {};
  } else {
    return object;
  }

  for (const [key, value] of Object.entries(object)) {
    output[key] = deepClone(value);
  }
  return output;
}
