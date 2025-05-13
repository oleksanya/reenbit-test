import { Component } from '@angular/core';
import { ProfileImgComponent } from '../profile-img/profile-img.component';

@Component({
  selector: 'app-chat-list-item',
  standalone: true,
  imports: [ProfileImgComponent],
  templateUrl: './chat-list-item.component.html',
  styleUrl: './chat-list-item.component.css',
})
export class ChatListItemComponent {
  clickDialog() {
    console.log('future click dialog');
  }
}
