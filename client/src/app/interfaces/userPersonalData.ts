import { Chat } from "./chat";

export interface UserPersonalData {
  _id: string;
  firstName: string;
  secondName: string;
  profileImg: string;
}


export interface UserWithChats {
  _id: string;
  chats: Chat[];
}

