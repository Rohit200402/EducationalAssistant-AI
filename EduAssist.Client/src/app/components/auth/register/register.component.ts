import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form = { firstName: '', lastName: '', displayName: '', email: '', userName: '', password: '', confirmPassword: '', institution: '', grade: '', preferredLanguage: 'English' };
  loading = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router, private toast: ToastService) {}

  register(): void {
    if (this.form.password !== this.form.confirmPassword) { this.toast.warning('Passwords do not match.'); return; }
    if (!this.form.firstName || !this.form.email || !this.form.userName || !this.form.password) { this.toast.warning('Please fill required fields.'); return; }
    this.loading = true;
    this.authService.register(this.form).subscribe({
      next: (response) => {
        this.loading = false;
        this.toast.success('Registration successful!');
        this.router.navigate(['/user/dashboard']);
      },
      error: (err) => { this.loading = false; this.toast.error(err.error?.message || 'Registration failed.'); }
    });
  }
}
