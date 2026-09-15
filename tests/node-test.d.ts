declare module 'node:test' {
  type TestBody = () => void | Promise<void>;

  export function test(
    name: string,
    body: TestBody,
  ): void;
}

declare module 'node:assert/strict' {
  interface StrictAssert {
    equal(actual: unknown, expected: unknown): void;
    deepEqual(actual: unknown, expected: unknown): void;
    ok(value: unknown): void;
    throws(
      callback: () => unknown,
      expected?: RegExp,
    ): void;
  }

  const assert: StrictAssert;
  export default assert;
}
