import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chat, ChatResponse } from '../interfaces/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'api/chats';

  http = inject(HttpClient)

  constructor() { }

  getChatsDataByUserId(userId: string): Observable<ChatResponse> {
  return this.http.get<ChatResponse>(`${this.apiUrl}/getAllChats/${userId}`);
  }

  createChat(chatData: { 
    senderId: string; 
    receiverId: string; 
    }): Observable<{ chat: Chat }> {
    return this.http.post<{ chat: Chat }>(this.apiUrl, chatData);
  }

  getUserChats(userId: string): Observable<{ user: { chats: Chat[] } }> {
    return this.http.get<{ user: { chats: Chat[] } }>(`${this.apiUrl}/getAllChats/${userId}`);
  }

  deleteChat(chatId: string): Observable<{ message: string }> {
  return this.http.delete<{ message: string }>(`${this.apiUrl}/${chatId}`);
  }
}
