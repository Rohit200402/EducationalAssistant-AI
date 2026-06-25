import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts; track toast.id) {
        <div class="toast-item" [ngClass]="'toast-' + toast.type">
          <div class="toast-icon">
            <i [class]="toast.type === 'success' ? 'fas fa-check' : toast.type === 'error' ? 'fas fa-xmark' : toast.type === 'info' ? 'fas fa-info' : 'fas fa-exclamation'"></i>
          </div>
          <div class="toast-content">
            <span class="toast-message">{{ toast.message }}</span>
          </div>
          <button class="toast-close" (click)="toastService.remove(toast.id)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      }
    </div>
    <router-outlet></router-outlet>
  `,
  styles: [`:host { display: block; min-height: 100vh; }`]
})
export class AppComponent {
  constructor(public toastService: ToastService) {}
}
