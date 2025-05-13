import { Component } from '@angular/core';
import { ChatSidebarComponent } from '../chat-sidebar/chat-sidebar.component';
import { ChatBodyComponent } from '../chat-body/chat-body.component';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [ChatSidebarComponent, ChatBodyComponent],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.css',
})
export class ChatContainerComponent {}
