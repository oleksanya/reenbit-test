import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './components/toast/toast.component';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnDestroy {
  title = 'Test Chat App';
  http = inject(HttpClient);
  private socketService = inject(SocketService);
  constructor() {
    this.initializeSocket();

    window.addEventListener('storage', (event) => {
      if (event.key === 'jwtToken') {
        this.initializeSocket();
      }
    });
  }

  private initializeSocket(): void {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      this.socketService.connect(token);
    } else {
      console.error('No token found, not connecting socket');
    }
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }
}
