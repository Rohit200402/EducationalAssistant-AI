import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminNavbarComponent, FooterComponent],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  form = { firstName: '', lastName: '', displayName: '', email: '', userName: '', password: '', institution: '', grade: '', bio: '', dateOfBirth: null as string | null, preferredLanguage: 'English', role: 'User' };
  loading = false;
  constructor(private userService: UserService, private router: Router, private toast: ToastService) {}
  submit(): void {
    this.loading = true;
    this.userService.create(this.form as any).subscribe({
      next: () => { this.toast.success('User created!'); this.router.navigate(['/admin/users']); },
      error: (err) => { this.loading = false; this.toast.error(err.error?.message || 'Failed'); }
    });
  }
}
