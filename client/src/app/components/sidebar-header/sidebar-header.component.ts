import { Component, computed, inject, input } from '@angular/core';
import { ProfileImgComponent } from '../profile-img/profile-img.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { User } from '../../interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-header',
  standalone: true,
  imports: [ProfileImgComponent, SearchBarComponent],
  templateUrl: './sidebar-header.component.html',
  styleUrl: './sidebar-header.component.css',
})
export class SidebarHeaderComponent {
  router = inject(Router);
  
  user = input<User>();
  userImg = computed(() => this.user()?.profileImg);

  signOut() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/auth']);
  }
}
