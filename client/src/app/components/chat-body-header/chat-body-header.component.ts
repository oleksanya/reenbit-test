import { Component, computed, input } from '@angular/core';
import { ProfileImgComponent } from '../profile-img/profile-img.component';
import { UserPersonalData } from '../../interfaces/userPersonalData';

@Component({
  selector: 'app-chat-body-header',
  standalone: true,
  imports: [ProfileImgComponent],
  templateUrl: './chat-body-header.component.html',
  styleUrl: './chat-body-header.component.css',
})
export class ChatBodyHeaderComponent {
  receiverData = input<UserPersonalData>();
  
  receiverUserPhoto = computed(() => {
    if (!this.receiverData()) return '';
    return this.receiverData()?.profileImg === 'bot-profile.png'
      ? 'app/assets/images/bot-profile.png'
      : this.receiverData()?.profileImg || '';
  });
}
