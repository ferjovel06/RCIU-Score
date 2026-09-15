export function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value);
}

export function readString(
  object: Record<string, unknown>,
  property: string,
): string {
  const value = object[property];

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${property} must be a non-empty string`);
  }

  return value;
}

export function readInteger(
  object: Record<string, unknown>,
  property: string,
): number {
  const value = object[property];

  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new Error(`${property} must be an integer`);
  }

  return value;
}

export function readNullableString(
  object: Record<string, unknown>,
  property: string,
): string | null {
  const value = object[property];

  if (value === null) {
    return null;
  }

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(
      `${property} must be a non-empty string or null`,
    );
  }

  return value;
}
