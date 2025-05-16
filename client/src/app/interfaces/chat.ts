import { LastMessage } from "./lastMessage";
import { Message } from "./message";
import { UserPersonalData, UserWithChats } from "./userPersonalData";

export interface Chat {
  _id: string;
  senderId: UserPersonalData;
  receiverId: UserPersonalData;
  messages: Message[];
  lastMessage: LastMessage;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatResponse {
  user: UserWithChats;
}