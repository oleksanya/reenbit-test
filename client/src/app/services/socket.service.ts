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
    this.socket = io('http://localhost:2000', {
      withCredentials: true,
      autoConnect: false
    });
  }

  // Connect to socket server with user authentication
  connect(token: string): void {
    if (this.isConnected) {
      return;
    }

    this.socket.auth = { token };
    this.socket.connect();
    this.setupSocketListeners();
    this.isConnected = true;
  }

  disconnect(): void {
    if (this.isConnected) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  // Set up all socket event listeners
  private setupSocketListeners(): void {
    // New message received
    this.socket.on('newMessage', (message: Message) => {
      this.newMessageSubject.next(message);
    });

    // Message edited
    this.socket.on('messageEdited', (message: Message) => {
      this.messageEditedSubject.next(message);
    });

    // User typing
    this.socket.on('userTyping', (data: {userId: string, chatId: string}) => {
      this.userTypingSubject.next(data);
    });

    // Handle connection/disconnection
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

  // Message events
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

  // Typing events
  emitTyping(chatId: string): void {
    if (this.isConnected) {
      this.socket.emit('typing', chatId);
    }
  }

  // Observable streams
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
