import {RolePermissionsDTO} from './RolePermissionsDTO';


export interface UserRolePermissionsDTO {
  id: number;
  name: string;
  rolePermissions: RolePermissionsDTO[];
}

