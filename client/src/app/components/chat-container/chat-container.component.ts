import { Component, inject, OnInit } from '@angular/core';
import { ChatSidebarComponent } from '../chat-sidebar/chat-sidebar.component';
import { ChatBodyComponent } from '../chat-body/chat-body.component';
import { HttpClient } from '@angular/common/http';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../interfaces/chat';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [ChatSidebarComponent, ChatBodyComponent],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.css',
})
export class ChatContainerComponent implements OnInit{
  user: User | null = null;
  chatIds: Chat[] = [];
  chatsData: Chat[] = [];
  loadedChats: Chat[] = [];
  selectedChatId: string  = '';
  selectedChatData?: Chat;


  private userService = inject(UserService);
  private chatService = inject(ChatService);

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const token = localStorage.getItem('jwtToken');

    if (!token) return;

    this.userService.getCurrentUser().subscribe({
      next: (res) => {
        this.user = res.user;
        this.getUserChats();
        this.getChatData(this.user._id);
      },
      error: (err) => console.error('Failed to fetch user:', err)
    });
  }

  getUserChats(): void {
    if(!this.user?._id) return

    this.chatService.getUserChats(this.user._id).subscribe({
      next: (response) => {
      this.chatIds = response.user.chats;
    },
    error: (error) => console.error('Failed to fetch chats:', error)
    });
  }

  getChatData(userId: string): void {
    if (!userId) return;

    this.chatService.getChatsDataByUserId(userId).subscribe({
      next: (response) => {
        this.loadedChats = response.user.chats;
      },
      error: (error) => console.error('Failed to fetch chat data:', error)
    });
  }

  onChatSelect(chatId: string): void {
    this.selectedChatId = chatId;
    this.getSelectedChatData(chatId);
  }

  getSelectedChatData(chatId: string): void {
    this.chatService.getChatById(chatId).subscribe({
      next: (response) => {
        this.selectedChatData = response.chat;
      },
      error: (error) => console.error('Failed to fetch chat data:', error)
    });
  }
}
