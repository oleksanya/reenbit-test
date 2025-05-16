import { Component, ViewChild, inject, input, output, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileImgComponent } from '../profile-img/profile-img.component';
import { Chat } from '../../interfaces/chat';
import { UserPersonalData } from '../../interfaces/userPersonalData';
import { DatePipe } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { MessageService } from '../../services/message.service';
import { EditChatDialogComponent } from '../edit-chat-dialog/edit-chat-dialog.component';

@Component({
  selector: 'app-chat-list-item',
  standalone: true,
  imports: [ProfileImgComponent, DatePipe, CommonModule, EditChatDialogComponent],
  templateUrl: './chat-list-item.component.html',
  styleUrl: './chat-list-item.component.css',
})
export class ChatListItemComponent implements OnInit {
  @ViewChild('editDialog') editDialog!: EditChatDialogComponent;

  chat = input<Chat>();
  chatSelected = output<string>();
  chatDeleted = output<void>();

  chatService = inject(ChatService);
  messageService = inject(MessageService);
  
  receiverId!: UserPersonalData;
  receiverUserPhoto: string = '';
  isDeleting: boolean = false;

  localChat = signal<Chat | undefined>(undefined);

  isLastMessageFromBot = computed(() => {
    const lastMessage = this.localChat()?.lastMessage;
    if (!lastMessage) return false;
    return lastMessage.userId._id === this.localChat()?.receiverId._id;
  });

  constructor() {
    // Subscribe to new messages to update last message
    this.messageService.onNewMessage().subscribe((message) => {
      if (message?._id && message.chatId === this.localChat()?._id) {
        this.localChat.update(current => current ? {
          ...current,
          lastMessage: {
            chatId: message.chatId,
            content: message.content,
            userId: message.userId,
            createdAt: message.createdAt.toString()
          }
        } : current);
      }
    });
  }

  ngOnInit(): void {
    this.localChat.set(this.chat());
    this.receiverId = this.chat()?.receiverId as UserPersonalData;
    
    if(this.receiverId.profileImg === 'bot-profile.png') {
      this.receiverUserPhoto = 'https://media.istockphoto.com/id/1221348467/vector/chat-bot-ai-and-customer-service-support-concept-vector-flat-person-illustration-smiling.jpg?s=612x612&w=0&k=20&c=emMSOYb4jWIVQQBVpYvP9LzGwPXXhcmbpZHlE6wgR78='
    } else {
      this.receiverUserPhoto = this.receiverId.profileImg;
    }
  }
  clickDialog(): void {
    if (!this.isDeleting) {
      this.chatSelected.emit(this.localChat()?._id ?? '');
    }
  }

  showEditDialog(event: Event): void {
    event.stopPropagation();
    this.editDialog.show(
      this.chat()?._id ?? '',
      this.receiverId.firstName,
      this.receiverId.secondName
    );
  }

  async deleteChat(event: Event): Promise<void> {
    try {
      event.stopPropagation();
      
      const chatId = this.chat()?._id;
      if (!chatId || this.isDeleting) return;
      
      this.isDeleting = true;
      
      if (confirm('Are you sure you want to delete this chat?')) {
        await this.chatService.deleteChat(chatId).subscribe({
          next: () => {
            this.chatDeleted.emit();
            window.location.reload(); // Temporary solution to refresh chat list
          },
          error: (err) => {
            console.error('Error deleting chat:', err);
            this.isDeleting = false;
          }
        });
      } else {
        this.isDeleting = false;
      }
    } catch (err) {
      console.error('Error deleting chat:', err);
      this.isDeleting = false;
    }
  }
}
