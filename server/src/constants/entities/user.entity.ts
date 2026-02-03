
export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  birthday?: Date | null;
  createdAt: Date;
}