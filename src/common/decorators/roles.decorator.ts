
import { SetMetadata } from '@nestjs/common';
export const ROLES = 'roles'
export const Roles =(roles:string[]) => SetMetadata(ROLES,roles);

/**
 * as when you use this decorate :
 * @Roles(['admin','user'])
 * ehat you will pass to decorator here: array of strings 
 */
