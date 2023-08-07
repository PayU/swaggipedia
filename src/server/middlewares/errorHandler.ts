import HttpStatusCodes from 'http-status-codes';
import { Context, Middleware, Next } from 'koa';
import { InputValidationError } from 'openapi-validator-middleware';
import logger from '../../helpers/logger';

export interface ErrorResponse {
  message?: string;
}

export default function (): Middleware {
  return async function (ctx: Context, next: Next): Promise<void> {
    try {
      await next();

      // Route not found
      if (ctx.status === HttpStatusCodes.NOT_FOUND && !ctx.body) {
        ctx.throw(
          ctx.status,
          HttpStatusCodes.getStatusText(HttpStatusCodes.NOT_FOUND)
        );
      }
    } catch (error) {
      const { status, stack, message } = error;

      if (error instanceof InputValidationError) {
        // Input validation
        ctx.status = HttpStatusCodes.BAD_REQUEST;
        ctx.body = {
          message: Array.isArray(error.errors)
            ? JSON.stringify(error.errors)
            : error.errors,
        } as ErrorResponse;
      } else if (status && status < HttpStatusCodes.INTERNAL_SERVER_ERROR) {
        // Thrown error
        ctx.status = status;
        ctx.body = {
          message,
        } as ErrorResponse;
      } else {
        // Internal error
        ctx.status = HttpStatusCodes.INTERNAL_SERVER_ERROR;
        ctx.body = {
          more_info: stack,
        } as ErrorResponse;

        logger.error(
          { error, context: ctx.context },
          HttpStatusCodes.getStatusText(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        );
      }
    }
  };
}
