import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC } from 'src/common/decorators/public.decorator';
import { ROLES } from 'src/common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // public routes bypass everything
    const publicVal = this.reflector.get(PUBLIC, context.getHandler());
    if (publicVal) return true;

    const roles = this.reflector.getAllAndOverride<string[]>(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);

    // no @Roles() set on this route -> no restriction
    if (!roles || roles.length === 0) return true;

    if (!request.user || !roles.includes(request.user.role)) {
      throw new UnauthorizedException('not allowed');
    }

    return true;
  }
}