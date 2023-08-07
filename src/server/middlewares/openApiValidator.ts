import { Middleware } from 'koa';
import { init, validate } from 'openapi-validator-middleware';
import { join } from 'path';

const swaggerDir = join(__dirname, '..', '..', 'swagger.yaml');
init(swaggerDir, {
  beautifyErrors: true,
  framework: 'koa',
});

export default function validator(): Middleware {
  return validate;
}
