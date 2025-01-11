import { UserAccountDTO } from '@model';

export interface UserDTO {
    account: UserAccountDTO;
    accountStatus: string;
    agentCode: string;
    cardNumber: string;
    createdBy: string;
    createdDate: Date;
    deletedBy: string;
    deletedDate: Date;
    email: string;
    firstName: string;
    id: number;
    invalidPinCount: number;
    isAccept: boolean;
    isBankApprove: boolean;
    isBankConnect: boolean;
    isEnabled: boolean;
    isFcnUpload: boolean;
    isKyc: boolean;
    isNonExpired: boolean;
    isNonLocked: boolean;
    isOtp: boolean;
    isSuitTest: boolean;
    isUpload: boolean;
    isUserBlackList: boolean;
    isVerifyEmail: boolean;
    kycRequestId: string;
    lastName: string;
    passportCountry: string;
    pdpaVersion: number;
    phoneNumber: string;
    profileImageUrl: string;
    termVersion: number;
    updatedBy: string;
    updatedDate: Date;
    username: string;
}
