import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles?.length) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request?.user;
    return this.matchRoles(roles, user.role);
  }

  private matchRoles(allowedRoles: string[], userRole: string) {
    return allowedRoles.includes(userRole);
  }
}
