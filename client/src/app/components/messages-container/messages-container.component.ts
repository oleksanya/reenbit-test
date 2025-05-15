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
  
  private messageService = inject(MessageService);

  localMessages = signal<Message[]>([]);

  constructor() {
    // Update local messages when input messages change
    effect(() => {
      const newMessages = this.messages();
      if (newMessages?.length) {
        this.localMessages.set(newMessages);
      }
    }, { allowSignalWrites: true });

    // Handle real-time message updates
    this.messageService.onNewMessage().subscribe((message) => {
      if (message?._id) {
        this.localMessages.update(current => [...current, message]);
      }
    });

    // Handle edited messages
    this.messageService.onMessageEdited().subscribe((editedMessage) => {
      if (editedMessage?._id) {
        this.localMessages.update(current =>
          current.map(msg => msg._id === editedMessage._id ? editedMessage : msg)
        );
      }
    });

    // Handle deleted messages
    this.messageService.onMessageDeleted().subscribe(({ messageId }) => {
      if (messageId) {
        this.localMessages.update(current =>
          current.filter(msg => msg._id !== messageId)
        );
      }
    });
  }
}
