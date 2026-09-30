export class RequestError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'RequestError';
  }
}

export class ValidationError extends RequestError {
  constructor(fieldErrors: Record<string, string[]>) {
    const message = ValidationError.formatFieldErrors(fieldErrors);
    super(400, message);
    this.errors = fieldErrors;
    this.name = 'ValidationError';
  }

  static formatFieldErrors(errors: Record<string, string[]>): string {
    const formattedMessages = Object.entries(errors).map(
      ([field, messages]) => {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        const firstMessage = messages[0] ?? '';

        if (
          firstMessage === 'Required' ||
          firstMessage.toUpperCase().includes('received undefined')
        ) {
          return `${fieldName} is required`;
        }
        return messages.join(' and ');
      },
    );

    return formattedMessages.join(', ');
  }
}

export class NotFoundError extends RequestError {
  constructor(resource: string = 'Resource') {
    super(404, `${resource} not found.`);
    this.name = 'NotFoundError';
  }
}

export class ForbiddenError extends RequestError {
  constructor(message: string = 'You do not have permission to do this.') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

export class UnauthorizedError extends RequestError {
  constructor(message: string = 'Please sign in to continue.') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

export class ConflictError extends RequestError {
  constructor(message: string = 'This already exists.') {
    super(409, message);
    this.name = 'ConflictError';
  }
}

export function throwPostgresError(
  error: { code?: string; message: string },
  resource: string,
): never {
  if (error.code === '23505')
    throw new ConflictError(`${resource} already exists.`);
  if (error.code === '42501')
    throw new ForbiddenError(
      `You cannot modify this ${resource.toLowerCase()}.`,
    );
  if (error.code === '23503') throw new NotFoundError(resource);
  // Business rule raised by our own SQL functions: the message is written for users
  if (error.code === 'P0001') throw new ConflictError(error.message);
  throw new RequestError(500, `Could not save the ${resource.toLowerCase()}.`);
}
