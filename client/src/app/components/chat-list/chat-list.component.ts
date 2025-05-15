import { Component, input, output } from '@angular/core';
import { ChatListItemComponent } from '../chat-list-item/chat-list-item.component';
import { Chat } from '../../interfaces/chat';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [ChatListItemComponent],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.css',
})
export class ChatListComponent {
  chats = input<Chat[]>();
  chatSelected = output<string>();

  onChatSelect(chatId: string): void {
    this.chatSelected.emit(chatId);
  }
}
