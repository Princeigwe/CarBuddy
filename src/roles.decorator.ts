import { SetMetadata } from "@nestjs/common";
import {Role } from 'src/enums/role.enum'

/**
 * defining the rolesKey.
 * creating a function that will return a specific role value, based on the role enum
 */
export const ROLES_KEY = 'role'; 
export const Roles = (...role: Role[]) => SetMetadata(ROLES_KEY, role);