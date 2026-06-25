import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email = '';
  token = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;
  success = false;
  showPassword = false;

  constructor(private http: HttpClient, private toast: ToastService) {}

  submit(): void {
    if (!this.email || !this.token || !this.newPassword || !this.confirmPassword) {
      this.toast.warning('Please fill in all fields.'); return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.toast.warning('Passwords do not match.'); return;
    }
    this.loading = true;
    this.http.post<{ message: string }>(`${environment.apiUrl}/auth/reset-password`, {
      email: this.email,
      token: this.token,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = true;
        this.toast.success(res.message);
      },
      error: (err) => { this.loading = false; this.toast.error(err.error?.message || 'Reset failed.'); }
    });
  }
}
