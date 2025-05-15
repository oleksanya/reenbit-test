import { User } from "./user";

export interface LastMessage {
  chatId: string,
  content: string,
  userId: User,
  createdAt: string
}