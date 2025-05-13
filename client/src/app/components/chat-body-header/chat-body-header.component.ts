import { Component } from '@angular/core';
import { ProfileImgComponent } from '../profile-img/profile-img.component';

@Component({
  selector: 'app-chat-body-header',
  standalone: true,
  imports: [ProfileImgComponent],
  templateUrl: './chat-body-header.component.html',
  styleUrl: './chat-body-header.component.css',
})
export class ChatBodyHeaderComponent {}
