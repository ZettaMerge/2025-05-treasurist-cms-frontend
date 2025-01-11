import { PermissionDTO } from './PermissionDTO';

export interface RolePermissionsDTO {
  canApprove: boolean;
  canCreate: boolean;
  canDelete: boolean;
  canExport: boolean;
  canUpdate: boolean;
  canView: boolean;
  createdBy: string;
  createdDate: Date;
  deletedBy: string;
  deletedDate: Date;
  id: number;
  permission: PermissionDTO;
  roleId: number;
  updatedBy: string;
  updatedDate: Date;
}


