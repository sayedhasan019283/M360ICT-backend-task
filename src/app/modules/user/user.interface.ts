// hr_users.interface.ts
export type THrUser = {
  message: any;
  id: number;
  email: string;
  password_hash: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}
