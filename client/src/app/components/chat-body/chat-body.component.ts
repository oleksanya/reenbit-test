import { Component } from '@angular/core';
import { ChatBodyHeaderComponent } from '../chat-body-header/chat-body-header.component';
import { MessagesContainerComponent } from '../messages-container/messages-container.component';
import { MessageInputComponent } from '../message-input/message-input.component';

@Component({
  selector: 'app-chat-body',
  standalone: true,
  imports: [ChatBodyHeaderComponent, MessagesContainerComponent, MessageInputComponent],
  templateUrl: './chat-body.component.html',
  styleUrl: './chat-body.component.css',
})
export class ChatBodyComponent {}
