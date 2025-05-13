import { Component } from '@angular/core';
import { ProfileImgComponent } from '../profile-img/profile-img.component';

@Component({
  selector: 'app-messages-container-item',
  standalone: true,
  imports: [ProfileImgComponent],
  templateUrl: './messages-container-item.component.html',
  styleUrl: './messages-container-item.component.css',
})
export class MessagesContainerItemComponent {}
