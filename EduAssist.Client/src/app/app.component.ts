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
        <div [class]="'toast-' + toast.type" (click)="toastService.remove(toast.id)">
          <i [class]="toast.type === 'success' ? 'fas fa-check-circle' : toast.type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-exclamation-triangle'"></i>
          {{ toast.message }}
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
