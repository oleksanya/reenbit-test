import { Component, inject, input } from '@angular/core';
import { MessageService } from '../../services/message.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.css',
})
export class MessageInputComponent {
  userId = input<string>();
  chatId = input<string>();
  messageText: string = '';
  messageService  = inject(MessageService);
  
  constructor() {}

  send() {
    if (!this.messageText?.trim()) return;
    
    const userId = this.userId();
    const chatId = this.chatId();
    
    if (userId && chatId) {
      this.messageService.sendMessage(
        userId,
        chatId,
        this.messageText.trim()
      ).subscribe({
        next: (response) => {
          console.log('Message sent:', response);
          this.messageText = '';
        },
        error: (error) => {
          console.error('Error sending message:', error);
        }
      });
    }
  }

  handSubmit(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }
}
