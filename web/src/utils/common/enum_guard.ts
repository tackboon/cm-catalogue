export function withEnumGuard<T extends Object>(e: T) {
  const values = Object.values(e);

  return Object.assign(e, {
    check(value: unknown): value is T[keyof T] {
      return values.includes(value);
    },
  });
}
