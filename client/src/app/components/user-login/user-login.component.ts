import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {
  private apiUrl = '/api';
  private clientId: string = '963449429561-3aop0g30iq3hthks01ikb9sod340mr0d.apps.googleusercontent.com';

  http = inject(HttpClient);
  router = inject(Router);
  
  constructor() {}

  ngOnInit(): void {
    if ((window as any).google && window.google.accounts?.id) {
      this.initGoogleSignIn();
    } else {
      window.addEventListener('load', () => {
    
      if (window.google && window.google.accounts?.id) {
        this.initGoogleSignIn();
      }
    });
  }
}

  initGoogleSignIn(): void {
    window.google.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.handleCredentialResponse.bind(this),
    });

    window.google.accounts.id.renderButton(
      document.getElementById('google-signin-button')!, 
      { theme: 'outline', size: 'large' }
    );
  }

  handleCredentialResponse(response: any): void {
    this.sendTokenToBackend(response.credential);
  }

  sendTokenToBackend(token: string): void {
    this.http.post<{ jwtToken: string, user?: any }>(`${this.apiUrl}/auth/google`, { token })
    .subscribe({
      next: (res) => {
        if(res.jwtToken) {
          localStorage.setItem('jwtToken', res.jwtToken);
          localStorage.setItem('userId', res.user.id);
          this.router.navigate(['/chat']);
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

createUserProfile(userData: any): void {
  this.http.post<{ user: any, jwtToken: string }>(`${this.apiUrl}/user/create`, userData)
    .subscribe({
      next: (res) => {
        localStorage.setItem('jwtToken', res.jwtToken);

        this.router.navigate(['/chat']);
      },
      error: (error) => {
        console.error('Error creating user:', error);
      },
    });
  }

  enterAsDefaultUser() {
    console.log('future default user creation')
  }
}