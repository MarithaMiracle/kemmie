
import { UserEntity } from './user.entity';

export interface RelationshipEntity {
  id: string;
  joinCode: string;
  createdAt: Date;
}

export interface RelationshipMemberEntity {
  id: string;
  relationshipId: string;
  userId: string;
  createdAt: Date;
  user?: UserEntity;
}