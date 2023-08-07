import StatusCodes from 'http-status-codes';
import { Context } from 'koa';
// import { HEALTH_STATUS } from '../../helpers/common';

export class HealthController {
  async checkHealth(ctx: Context): Promise<void> {
    const responseBody = {
      status: 'up',
    };
    ctx.body = responseBody;
    ctx.status = StatusCodes.OK;
  }
}
