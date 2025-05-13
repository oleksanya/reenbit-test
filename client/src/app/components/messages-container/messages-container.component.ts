import { Component } from '@angular/core';
import { MessagesContainerItemComponent } from '../messages-container-item/messages-container-item.component';
import { MessageInputComponent } from '../message-input/message-input.component';

@Component({
  selector: 'app-messages-container',
  standalone: true,
  imports: [MessagesContainerItemComponent, MessageInputComponent],
  templateUrl: './messages-container.component.html',
  styleUrl: './messages-container.component.css',
})
export class MessagesContainerComponent {}
