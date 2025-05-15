export interface User {
  _id: string;
  firstName: string;
  secondName: string;
  profileImg: string;
  chats: [];
  createdAt: Date;
  updatedAt: Date;
}
