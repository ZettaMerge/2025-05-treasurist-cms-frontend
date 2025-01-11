import { RolePermissionsDTO } from './RolePermissionsDTO';

export interface RoleDTO {
  createdBy: string;
  createdDate: Date;
  id: number;
  name: string;
  rolePermissions: RolePermissionsDTO[];
  updatedBy: string;
  updatedDate: Date;
}
