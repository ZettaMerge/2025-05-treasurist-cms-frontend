import {UserRolePermissionsDTO} from './UserRolePermissionsDTO';

export interface CurrentUserDTO {
  accountStatus: string;
  cardNumber?: string;
  createdBy: string;
  createdDate: Date;
  email?: string;
  id: number;
  isAccept?: boolean;
  isBankApprove?: string;
  isEnabled: boolean;
  isKyc: boolean;
  isNonExpired: boolean;
  isNonLocked: boolean;
  isOtp: boolean;
  isUserBlackList?: string;
  kycRequestId: string;
  passportCountry?: string;
  password?: string;
  profileImageUrl?: string;
  updatedBy: string;
  updatedDate: Date;
  username: string;
  userRolePermissions: UserRolePermissionsDTO;
}
