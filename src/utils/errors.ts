export class InvalidArgumentError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidArgumentError';
  }
}

export function validateArgument(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new InvalidArgumentError(message);
  }
}
