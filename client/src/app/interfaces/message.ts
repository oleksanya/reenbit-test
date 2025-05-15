export interface Message {
  _id: string;
  userId: string;
  chatId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}