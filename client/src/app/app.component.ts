import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Test Chat App';
  http = inject(HttpClient);

  constructor() {
    this.http.get('api/test').subscribe((response) => {
      console.log('Test response:', response);
    });
  }
}
