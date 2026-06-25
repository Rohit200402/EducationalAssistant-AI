import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminNavbarComponent, FooterComponent],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  user: User | null = null;
  form = { firstName: '', lastName: '', displayName: '', institution: '', grade: '', bio: '', dateOfBirth: null as string | null, preferredLanguage: 'English', isActive: true };
  loading = false;
  userId = '';

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router, private toast: ToastService) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';
    this.userService.getById(this.userId).subscribe(user => {
      this.user = user;
      this.form = { firstName: user.firstName, lastName: user.lastName, displayName: user.displayName, institution: user.institution, grade: user.grade, bio: user.bio, dateOfBirth: user.dateOfBirth || null, preferredLanguage: user.preferredLanguage, isActive: user.isActive };
    });
  }

  submit(): void {
    this.loading = true;
    this.userService.update(this.userId, this.form as any).subscribe({
      next: () => { this.toast.success('User updated!'); this.router.navigate(['/admin/users']); },
      error: (err) => { this.loading = false; this.toast.error(err.error?.message || 'Failed'); }
    });
  }
}
