import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router, private toast: ToastService) {}

  login(): void {
    if (!this.email || !this.password) { this.toast.warning('Please fill in all fields.'); return; }
    this.loading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.loading = false;
        this.toast.success(`Welcome back, ${response.displayName}!`);
        if (response.roles.includes('Admin')) this.router.navigate(['/admin/dashboard']);
        else this.router.navigate(['/user/dashboard']);
      },
      error: (err) => { this.loading = false; this.toast.error(err.error?.message || 'Login failed.'); }
    });
  }
}
