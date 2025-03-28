import { createProxy } from "./proxy";

export { observer, Observer } from "./observer";

export function reactive<T extends Record<string, any>>(value: T): T {
  return createProxy(value);
}

function readonly<T extends Record<string, any>>(value: T): T {
  return createProxy(value, true);
}

reactive.readonly = readonly;
