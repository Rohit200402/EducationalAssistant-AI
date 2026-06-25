import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NotificationService } from '../../../services/notification.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-create-notification',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminNavbarComponent, FooterComponent],
  templateUrl: './create-notification.component.html',
  styleUrls: ['./create-notification.component.css']
})
export class CreateNotificationComponent {
  title = '';
  message = '';
  type = 'announcement';
  loading = false;

  constructor(private notificationService: NotificationService, private toast: ToastService, private cdr: ChangeDetectorRef) {}

  submit(): void {
    if (!this.title || !this.message) { this.toast.warning('Please fill in all required fields.'); return; }
    this.loading = true;
    this.notificationService.broadcast({ title: this.title, message: this.message, type: this.type }).subscribe({
      next: () => {
        this.loading = false;
        this.toast.success('Notification broadcast successfully!');
        this.title = '';
        this.message = '';
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.toast.error('Failed to broadcast notification.'); }
    });
  }
}
