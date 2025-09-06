export interface ILogin {
  email: string;
  password_hash: string;
}

export interface IVerifyEmail {
  email: string;
  oneTimeCode: number;
  
}
export interface IResetPassword {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
}
