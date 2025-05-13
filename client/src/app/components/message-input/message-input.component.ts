import { Component } from '@angular/core';

@Component({
  selector: 'app-message-input',
  standalone: true,
  imports: [],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.css',
})
export class MessageInputComponent {
  send() {
    console.log('future send message');
    //clear input
    const input = document.querySelector('input');
    if (input) {
      input.value = '';
    }
  }

  handSubmit(event: { keyCode: number }) {
    if (event.keyCode === 13) {
      console.log('future submit message');
    }
  }
}
