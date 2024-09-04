export interface LoginModel {
  UserId: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  RoleId: number;
  PhoneNo: string;
  UserPhoto: string;
  IsFirstLogin: boolean;
  RoleName: string;
  ErrorMessage: string;
  IsBlocked: boolean;
  JWTToken: string;
  EncryptedUserId: string;
  Is2FARequired: boolean;
  VerifyUser: string;
  BranchId: number;
}
