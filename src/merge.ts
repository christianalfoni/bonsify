export function merge<T extends Record<string, any>[]>(
  ...sources: T
): UnionToIntersection<T[number]> {
  // Create a merged proxy object
  const mergedProxy = new Proxy(
    {},
    {
      get(_, key: any) {
        // Look through all sources for the property
        for (const source of sources) {
          if (key in source) {
            const value = source[key];

            // Handle functions by binding them to their original source
            if (typeof value === "function") {
              return value.bind(source);
            }

            return value;
          }
        }

        return undefined;
      },
      set(target, key: any, value) {
        // Look through all sources for the property
        for (const source of sources) {
          if (key in source) {
            return (source[key] = value);
          }
        }

        return Reflect.set(target, key, value);
      },
      // Allow property existence checks
      has(_, key) {
        return sources.some((source) => key in source);
      },
      // Support Object.keys() and similar methods
      ownKeys() {
        const keys = new Set<string | symbol>();
        for (const source of sources) {
          Object.keys(source).forEach((key) => keys.add(key));
        }
        return Array.from(keys);
      },
      // Support property descriptors
      getOwnPropertyDescriptor(_, key: any) {
        for (const source of sources) {
          if (key in source) {
            // We must set configurable to true for the proxy to work
            return { configurable: true, enumerable: true, value: source[key] };
          }
        }
        return undefined;
      },
    }
  );

  // Make the merged object reactive
  return mergedProxy as any;
}

// Helper type for converting union types to intersection types
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;
