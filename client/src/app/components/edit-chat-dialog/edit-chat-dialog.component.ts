import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-edit-chat-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-chat-dialog.component.html',
  styleUrls: ['./edit-chat-dialog.component.css']
})
export class EditChatDialogComponent {
  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;

  chatId: string = '';
  firstName: string = '';
  secondName: string = '';
  error: string = '';
  isUpdating: boolean = false;

  private chatService = inject(ChatService);

  show(chatId: string, firstName: string, secondName: string): void {
    this.chatId = chatId;
    this.firstName = firstName;
    this.secondName = secondName;
    this.error = '';
    this.dialog.nativeElement.showModal();
  }

  close(): void {
    this.dialog.nativeElement.close();
  }

  async save(): Promise<void> {
    try {
      if (!this.firstName.trim() || !this.secondName.trim()) {
        this.error = 'Both names are required';
        return;
      }

      if (!this.chatId || this.isUpdating) return;

      this.isUpdating = true;
      this.error = '';

      await this.chatService.updateChatUser(this.chatId, {
        firstName: this.firstName.trim(),
        secondName: this.secondName.trim()
      }).subscribe({
        next: (result) => {
          this.close();
          window.location.reload();
        },
        error: (error) => {
          console.error('Error updating chat:', error);
          this.error = 'Failed to update chat';
          this.isUpdating = false;
        }
      });
    } catch (err) {
      console.error('Error updating chat:', err);
      this.error = 'Failed to update chat';
      this.isUpdating = false;
    }
  }
}
