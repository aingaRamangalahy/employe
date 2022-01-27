import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (_data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest(); // get request body
    return req.user; // provided inside jwtStrategy validate function
  },
);
