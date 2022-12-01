import { ROLES_KEY } from './../util/roles.decorator';
import {Role} from './role.enum';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, mixin, Next, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      console.log('bukan role')
      return true;
    }
    console.log('role masuk')
    console.log(requiredRoles);
    
    const { user } = context.switchToHttp().getRequest();
    if(requiredRoles.includes(user.role)===false){
      console.log('masok sini')
        throw new ForbiddenException(`Required roles is ${requiredRoles}`)
    }
    //throw new ForbiddenException(`required roles is ${requiredRoles}`)
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}