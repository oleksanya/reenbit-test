import { Component, computed, effect, ElementRef, input, SimpleChanges, ViewChild } from '@angular/core';
import { ChatBodyHeaderComponent } from '../chat-body-header/chat-body-header.component';
import { MessagesContainerComponent } from '../messages-container/messages-container.component';
import { MessageInputComponent } from '../message-input/message-input.component';
import { User } from '../../interfaces/user';
import { Chat } from '../../interfaces/chat';

@Component({
  selector: 'app-chat-body',
  standalone: true,
  imports: [ChatBodyHeaderComponent, MessagesContainerComponent, MessageInputComponent],
  templateUrl: './chat-body.component.html',
  styleUrl: './chat-body.component.css',
})
export class ChatBodyComponent {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  user = input<User>();
  chatData = input<Chat>();

  receiverData = computed(() => this.chatData()?.receiverId);
  messages = computed(() => this.chatData()?.messages || []);

  constructor() {
    effect(() => {
      const messages = this.messages();
      if (messages?.length) {
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  private scrollToBottom(): void {
    try {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    } catch(err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
