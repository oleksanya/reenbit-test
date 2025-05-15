import { User } from "./user";

export interface Message {
  _id: string;
  userId: User;
  chatId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}