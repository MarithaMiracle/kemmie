
export interface RelationshipModel {
  id: string;
  joinCode: string;
}

export interface RelationshipMemberModel {
  id: string;
  relationshipId: string;
  userId: string;
}