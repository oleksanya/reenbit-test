import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-create-chat-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-chat-dialog.component.html',
  styleUrl: './create-chat-dialog.component.css'
})
export class CreateChatDialogComponent {
  firstName: string = '';
  secondName: string = '';
  isVisible: boolean = false;
  error: string = '';
  isLoading: boolean = false;

  private chatService = inject(ChatService);
  private userService = inject(UserService);

  show() {
    this.isVisible = true;
  }

  hide() {
    this.isVisible = false;
    this.firstName = '';
    this.secondName = '';
    this.error = '';
    this.isLoading = false;
  }

  async createChat() {
    if (!this.firstName.trim() || !this.secondName.trim()) {
      this.error = 'Both first and second names are required';
      return;
    }

    this.isLoading = true;
    this.error = '';

    try {
      // First get current user
      const currentUser = await firstValueFrom(this.userService.getCurrentUser());
      
      if (!currentUser?.user?._id) {
        throw new Error('Current user not found');
      }

      // Create chat with new user
      const result = await firstValueFrom(this.chatService.createChatWithNames({
        firstName: this.firstName.trim(),
        secondName: this.secondName.trim(),
        currentUserId: currentUser.user._id
      }));

      if (result) {
        this.hide();
        window.location.reload(); // Refresh chat list
      }
    } catch (err) {
      console.error('Create chat error:', err);
      const error = err as HttpErrorResponse;
      this.error = error.error?.message || 'Failed to create chat. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
