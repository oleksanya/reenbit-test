import { Injectable, signal } from '@angular/core';
import { Toast } from '../interfaces/toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private counter = 0;
  toasts = signal<Toast[]>([]);

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) {
    const id = this.counter++;
    const toast: Toast = { id, message, type, duration };
    
    this.toasts.update(current => [...current, toast]);

    setTimeout(() => {
      this.toasts.update(current => current.filter(t => t.id !== id));
    }, duration);
  }
}
