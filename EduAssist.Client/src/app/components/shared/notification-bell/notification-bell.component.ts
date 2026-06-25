import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';
import { NotificationDto } from '../../../models/notification.model';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.css']
})
export class NotificationBellComponent implements OnInit {
  notifications: NotificationDto[] = [];
  showDropdown = false;

  constructor(private notificationService: NotificationService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getUnread().subscribe({
      next: (data) => { this.notifications = data; this.cdr.detectChanges(); },
      error: () => {}
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) this.loadNotifications();
  }

  markRead(id: number): void {
    this.notificationService.markRead(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.notificationId !== id);
        this.cdr.detectChanges();
      }
    });
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'announcement': return 'fas fa-bullhorn';
      case 'reminder': return 'fas fa-clock';
      default: return 'fas fa-info-circle';
    }
  }
}
