import { Component } from '@angular/core';
import { SidebarHeaderComponent } from '../sidebar-header/sidebar-header.component';
import { ChatListComponent } from '../chat-list/chat-list.component';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [SidebarHeaderComponent, ChatListComponent],
  templateUrl: './chat-sidebar.component.html',
  styleUrl: './chat-sidebar.component.css',
})
export class ChatSidebarComponent {}
