import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '../interfaces/message';
import { Observable, Subject, finalize, tap, map } from 'rxjs';
import { ToastService } from './toast.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly baseUrl = '/api';
  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastService);
  private readonly socketService = inject(SocketService);

  private newMessageSubject = new Subject<Message>();
  private messageEditedSubject = new Subject<Message>();
  private messageDeletedSubject = new Subject<{ messageId: string, chatId: string }>();
  private processedMessageIds = new Set<string>();

  constructor() {    this.socketService.onNewMessage().subscribe(message => {
      if (message?._id && !this.processedMessageIds.has(message._id)) {

        this.processedMessageIds.add(message._id);
        
        this.newMessageSubject.next(message);
          // Only show toast for bot messages (not the current user's messages)
        const currentUserId = localStorage.getItem('userId');
        
        if (message.userId._id !== currentUserId && this.isFromBot(message)) {
          const messagePreview = message.content.length > 50 
            ? message.content.substring(0, 50) + '...' 
            : message.content;
          this.toastService.show(`Bot: ${messagePreview}`, 'info');
        }
      }
    });

    this.socketService.onMessageEdited().subscribe(message => {
      if (message?._id) {
        this.messageEditedSubject.next(message);
      }
    });

    this.socketService.onUserTyping().subscribe(({ userId }) => {
      this.toastService.show('User is typing...', 'info', 1000);
    });
  }

  onNewMessage(): Observable<Message> {
    return this.newMessageSubject.asObservable();
  }

  onMessageEdited(): Observable<Message> {
    return this.messageEditedSubject.asObservable();
  }

  onMessageDeleted(): Observable<{ messageId: string, chatId: string }> {
    return this.messageDeletedSubject.asObservable();
  } 
    private isFromBot(message: Message): boolean {
      return message?.userId?.firstName?.toLowerCase() === 'bot' || 
              message?.userId?.secondName?.toLowerCase() === 'assistant';
    }
    
    sendMessage(userId: string, chatId: string, content: string): Observable<Message> {
    const showBotTyping = () => {
      this.toastService.show('Bot is typing...', 'info', 2000);
    };

    return this.http.post<{ message: Message }>(`${this.baseUrl}/messages/send`, {
      userId,
      chatId,
      content
    }).pipe(
      tap((response) => {
        if (response.message?._id) {
          this.processedMessageIds.add(response.message._id);
          
          this.newMessageSubject.next(response.message);
        }
      }),
      map((response) => response.message),
      finalize(() => {
        setTimeout(showBotTyping, 500);
      })
    );
  }

  editMessage(messageId: string, content: string): Observable<Message> {
    return this.http.patch<{ message: Message }>(`${this.baseUrl}/messages/edit/${messageId}`, {
      content
    }).pipe(
      tap((response) => {
        if (response.message?._id) {
          this.messageEditedSubject.next(response.message);
          // Then emit through socket for other clients
          this.socketService.editMessage(messageId, content);
          this.toastService.show('Message updated successfully', 'success', 2000);
        }
      }),
      map((response) => response.message)
    );
  }

  emitTyping(chatId: string): void {
    this.socketService.emitTyping(chatId);
  }
}
