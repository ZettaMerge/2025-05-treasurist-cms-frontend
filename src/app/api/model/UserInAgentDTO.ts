

export interface UserInAgentDTO {
  accountStatus: string;
  cardNumber: string;
  createdBy: string;
  createdDate: Date;
  email: string;
  firstName: string;
  id: number;
  isAccept: boolean;
  isBankApprove: boolean;
  isBankConnect: boolean;
  isEnabled: boolean;
  isKyc: boolean;
  isNonExpired: boolean;
  isNonLocked: boolean;
  isOtp: boolean;
  isUserBlackList: boolean;
  kycRequestId: string;
  lastName: string;
  passportCountry: string;
  password: string;
  pdpaVersion: number;
  phoneNumber: string;
  pin: string;
  profileImageUrl: string;
  referralAgent: string;
  termVersion: number;
  updatedBy: string;
  updatedDate: Date;
  username: string;
}
