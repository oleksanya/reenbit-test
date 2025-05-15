import { Component, computed, inject, input, output } from '@angular/core';
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
  searchChange = output<string>();
  
  userImg = computed(() => this.user()?.profileImg);

  onSearch(term: string): void {
    this.searchChange.emit(term);
  }

  signOut() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/auth']);
  }
}
