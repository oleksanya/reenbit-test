import { Injectable, DestroyRef, inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Message } from '../interfaces/message';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private destroyRef = inject(DestroyRef);
  private isConnected = false;

  private newMessageSubject = new Subject<Message>();
  private messageEditedSubject = new Subject<Message>();
  private userTypingSubject = new Subject<{userId: string, chatId: string}>();
  constructor() {
    // Use relative URL for Socket.io to automatically connect to the current domain in production
    // This will use the same host as the page in production, or localhost:2000 in development
    const socketUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:2000'
      : '';
      
    this.socket = io(socketUrl, {
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000
    });
  }
  connect(token: string): void {
    if (this.isConnected) {
      return;
    }

    this.socket.auth = { token };
    
    try {
      this.socket.connect();
      this.setupSocketListeners();
      this.isConnected = true;
      console.log('Socket connection established');
    } catch (error) {
      console.error('Socket connection error:', error);

      setTimeout(() => {
        if (!this.isConnected) {
          console.log('Attempting to reconnect socket...');
          this.connect(token);
        }
      }, 2000);
    }
  }

  disconnect(): void {
    if (this.isConnected) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  private setupSocketListeners(): void {
    this.socket.on('newMessage', (message: Message) => {
      this.newMessageSubject.next(message);
    });

    this.socket.on('messageEdited', (message: Message) => {
      this.messageEditedSubject.next(message);
    });

    this.socket.on('userTyping', (data: {userId: string, chatId: string}) => {
      this.userTypingSubject.next(data);
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('Socket connection error:', error.message);
      this.isConnected = false;
    });
  }

  sendMessage(message: Message): void {
    if (this.isConnected) {
      this.socket.emit('sendMessage', message);
    }
  }

  editMessage(messageId: string, content: string): void {
    if (this.isConnected) {
      this.socket.emit('editMessage', { messageId, content });
    }
  }

  deleteMessage(messageId: string): void {
    if (this.isConnected) {
      this.socket.emit('deleteMessage', messageId);
    }
  }

  emitTyping(chatId: string): void {
    if (this.isConnected) {
      this.socket.emit('typing', chatId);
    }
  }

  onNewMessage(): Observable<Message> {
    return this.newMessageSubject.asObservable().pipe(
      takeUntilDestroyed(this.destroyRef)
    );
  }

  onMessageEdited(): Observable<Message> {
    return this.messageEditedSubject.asObservable().pipe(
      takeUntilDestroyed(this.destroyRef)
    );
  }

  onUserTyping(): Observable<{userId: string, chatId: string}> {
    return this.userTypingSubject.asObservable().pipe(
      takeUntilDestroyed(this.destroyRef)
    );
  }
}
