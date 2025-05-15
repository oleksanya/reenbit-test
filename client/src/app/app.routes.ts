import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadComponent: () =>
      import('./components/user-login/user-login.component').then(
        (m) => m.UserLoginComponent
      ),
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./components/chat-container/chat-container.component').then(
        (m) => m.ChatContainerComponent
      ),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '/auth' },
];