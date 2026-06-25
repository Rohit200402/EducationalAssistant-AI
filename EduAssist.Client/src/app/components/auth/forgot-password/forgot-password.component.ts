import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  token: string | null = null;
  success = false;

  constructor(private http: HttpClient, private toast: ToastService) {}

  submit(): void {
    if (!this.email) { this.toast.warning('Please enter your email.'); return; }
    this.loading = true;
    this.http.post<{ message: string; token: string }>(`${environment.apiUrl}/auth/forgot-password`, { email: this.email }).subscribe({
      next: (res) => {
        this.loading = false;
        this.token = res.token;
        this.success = true;
        this.toast.success(res.message);
      },
      error: (err) => { this.loading = false; this.toast.error(err.error?.message || 'Request failed.'); }
    });
  }
}
