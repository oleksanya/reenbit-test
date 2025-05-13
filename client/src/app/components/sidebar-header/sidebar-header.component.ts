import { Component } from '@angular/core';
import { ProfileImgComponent } from '../profile-img/profile-img.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-sidebar-header',
  standalone: true,
  imports: [ProfileImgComponent, SearchBarComponent],
  templateUrl: './sidebar-header.component.html',
  styleUrl: './sidebar-header.component.css',
})
export class SidebarHeaderComponent {
  signOut() {
    console.log('future sign out');
    // return this.auth.SignOut();
  }
}
