import { Component, computed, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-img',
  standalone: true,
  imports: [],
  templateUrl: './profile-img.component.html',
  styleUrl: './profile-img.component.css',
})
export class ProfileImgComponent {
  profileImg = input<string>();

}
