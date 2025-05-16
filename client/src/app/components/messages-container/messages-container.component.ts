import { Component, input, inject, signal, effect } from '@angular/core';
import { MessagesContainerItemComponent } from '../messages-container-item/messages-container-item.component';
import { Message } from '../../interfaces/message';
import { UserPersonalData } from '../../interfaces/userPersonalData';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-messages-container',
  standalone: true,
  imports: [MessagesContainerItemComponent],
  templateUrl: './messages-container.component.html',
  styleUrl: './messages-container.component.css',
})
export class MessagesContainerComponent {
  messages = input.required<Message[]>();
  userId = input.required<string>();
  receiverData = input.required<UserPersonalData>();
  chatId = input.required<string>();
  
  private messageService = inject(MessageService);

  localMessages = signal<Message[]>([]);

  constructor() {
    effect(() => {
      const newMessages = this.messages();
      this.localMessages.set(newMessages || []);
    }, { allowSignalWrites: true });    // Handle real-time message updates
    this.messageService.onNewMessage().subscribe((message) => {
      if (message?._id && message.chatId === this.chatId()) {
        // Check if message already exists in the list before adding
        this.localMessages.update(current => {
          // Check if this message ID already exists in our current messages
          const messageExists = current.some(msg => msg._id === message._id);
          
          // Only add if it doesn't already exist
          return messageExists ? current : [...current, message];
        });
      }
    });

    this.messageService.onMessageEdited().subscribe((editedMessage) => {
      if (editedMessage?._id && editedMessage.chatId === this.chatId()) {
        this.localMessages.update(current =>
          current.map(msg => msg._id === editedMessage._id ? editedMessage : msg)
        );
      }
    });

    this.messageService.onMessageDeleted().subscribe(({ messageId, chatId }) => {
      if (messageId && chatId === this.chatId()) {
        this.localMessages.update(current =>
          current.filter(msg => msg._id !== messageId)
        );
      }
    });
  }
}
