import { SetMetadata } from "@nestjs/common";
import {Role } from 'src/enums/role.enum'

/**
 * defining the rolesKey.
 * creating a function that will return a specific role value, based on the role enum
 */
export const ROLES_KEY = 'roles'; 
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);