
export interface UserModel {
  id: string;
  email: string;
  name: string;
  birthday?: Date | null;
}