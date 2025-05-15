import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileImgComponent } from '../profile-img/profile-img.component';
import { Message } from '../../interfaces/message';
import { UserPersonalData } from '../../interfaces/userPersonalData';

import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-messages-container-item',
  standalone: true,
  imports: [ProfileImgComponent, CommonModule, FormsModule],
  templateUrl: './messages-container-item.component.html',
  styleUrl: './messages-container-item.component.css',
})
export class MessagesContainerItemComponent {
  message = input<Message>();
  isOwnMessage = input<boolean>();
  receiverData = input<UserPersonalData>();

  messageService = inject(MessageService);
  
  isEditing = signal(false);
  editedContent = signal('');

  formattedDate = computed(() => {
    if (!this.message()) return '';
    return new Date(this.message()!.createdAt).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  });

  startEditing(): void {
    if (this.isOwnMessage()) {
      this.editedContent.set(this.message()?.content || '');
      this.isEditing.set(true);
    }
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }
  saveEdit(): void {
    const currentMessage = this.message();
    if (!currentMessage?._id || !this.editedContent()) return;

    this.messageService.editMessage(
      currentMessage._id,
      this.editedContent()
    ).subscribe({
      next: (updatedMessage) => {
        // Update the message content by triggering a change detection
        Object.assign(currentMessage, {
          content: updatedMessage.content,
          updatedAt: updatedMessage.updatedAt
        });
        this.isEditing.set(false);
      },
      error: (error) => {
        console.error('Error updating message:', error);
      }
    });
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }
}
