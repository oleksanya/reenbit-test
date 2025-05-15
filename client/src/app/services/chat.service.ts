import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Chat, ChatResponse } from '../interfaces/chat';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'api/chats';

  http = inject(HttpClient);

  constructor() { }

  getChatsDataByUserId(userId: string): Observable<ChatResponse> {
    return this.http.get<ChatResponse>(`${this.apiUrl}/getAllChats/${userId}`).pipe(
      tap(response => console.log('Chat data received:', response))
    );
  }

  getChatById(chatId: string): Observable<{ chat: Chat }> {
    return this.http.get<{ chat: Chat }>(`${this.apiUrl}/${chatId}`).pipe(
      tap(response => console.log('Individual chat data:', response))
    );
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

  createChatWithNames(chatData: {
    firstName: string;
    secondName: string;
    currentUserId: string;
  }): Observable<{ chat: Chat; user: User }> {
    return this.http.post<{ chat: Chat; user: User }>(
      `${this.apiUrl}/create-with-names`,
      chatData
    );
  }

  deleteChat(chatId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/delete/${chatId}`);
  }

  updateChatUser(chatId: string, data: { firstName: string; secondName: string }): Observable<{ chat: Chat }> {
    return this.http.put<{ chat: Chat }>(`${this.apiUrl}/update/${chatId}`, data);
  }
}
