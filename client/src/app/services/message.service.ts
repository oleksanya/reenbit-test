import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '../interfaces/message';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = '/api';
  http = inject(HttpClient);
  
  constructor() { }

  sendMessage(userId: string, chatId: string, content: string): Observable<Message> {
    return this.http.post<Message>(`${this.baseUrl}/messages/send`, {
      userId,
      chatId,
      content
    });
  }
}
