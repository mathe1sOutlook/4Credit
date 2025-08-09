class AppError extends Error {
  constructor(message, code, status) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'bad-request') {
    super(message, 'bad-request', 400);
  }
}

export class AuthError extends AppError {
  constructor(message = 'unauthenticated') {
    super(message, 'unauthenticated', 401);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'not-found') {
    super(message, 'not-found', 404);
  }
}

export function handleError(err) {
  if (err instanceof AppError) {
    return { status: err.status, code: err.code, message: err.message };
  }
  return { status: 500, code: 'internal', message: err.message || 'internal error' };
}
