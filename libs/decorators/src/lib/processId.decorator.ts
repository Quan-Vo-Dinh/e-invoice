import { getProcessId } from '@common/utils/string.utils';
import { MetadataKey } from '@common/constants/common.constant';
import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';

export const ProcessId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  Logger.debug('Request Object in ProcessId Decorator:', request);
  return request[MetadataKey.PROCESSID] || getProcessId();
});
