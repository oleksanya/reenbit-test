import { Component, ViewChild, input, output, signal, computed } from '@angular/core';
import { ChatListComponent } from '../chat-list/chat-list.component';
import { SidebarHeaderComponent } from '../sidebar-header/sidebar-header.component';
import { CreateChatDialogComponent } from '../create-chat-dialog/create-chat-dialog.component';
import { User } from '../../interfaces/user';
import { Chat } from '../../interfaces/chat';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [ChatListComponent, SidebarHeaderComponent, CreateChatDialogComponent],
  templateUrl: './chat-sidebar.component.html',
  styleUrl: './chat-sidebar.component.css'
})
export class ChatSidebarComponent {
  @ViewChild('createChatDialog') createChatDialog!: CreateChatDialogComponent;

  user = input<User>();
  chatIds = input<Chat[]>();
  chatSelected = output<string>();
  searchTerm = signal('');

  filteredChats = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.chatIds();
    
    return this.chatIds()?.filter(chat => 
      chat.receiverId.firstName.toLowerCase().includes(term) ||
      chat.receiverId.secondName.toLowerCase().includes(term)
    );
  });

  handleSearch(term: string): void {
    this.searchTerm.set(term);
  }

  onChatSelect(chatId: string): void {
    this.chatSelected.emit(chatId);
  }

  showCreateChatDialog(): void {
    this.createChatDialog.show();
  }
}
