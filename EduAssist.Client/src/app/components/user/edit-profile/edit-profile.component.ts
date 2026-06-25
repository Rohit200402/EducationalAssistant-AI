import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserNavbarComponent } from '../../shared/user-navbar/user-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';
import { User } from '../../../models/user.model';

@Component({ selector: 'app-edit-profile', standalone: true, imports: [CommonModule, FormsModule, RouterModule, UserNavbarComponent, FooterComponent], templateUrl: './edit-profile.component.html', styleUrls: ['./edit-profile.component.css'] })
export class EditProfileComponent implements OnInit {
  user: User | null = null;
  form = { firstName: '', lastName: '', displayName: '', institution: '', grade: '', bio: '', dateOfBirth: null as string | null, preferredLanguage: 'English' };
  loading = false;

  constructor(private userService: UserService, private toast: ToastService) {}
  ngOnInit(): void {
    this.userService.getProfile().subscribe(user => {
      this.user = user;
      this.form = { firstName: user.firstName, lastName: user.lastName, displayName: user.displayName, institution: user.institution, grade: user.grade, bio: user.bio, dateOfBirth: user.dateOfBirth || null, preferredLanguage: user.preferredLanguage };
    });
  }
  submit(): void {
    this.loading = true;
    this.userService.updateProfile(this.form as any).subscribe({
      next: () => { this.loading = false; this.toast.success('Profile updated!'); },
      error: () => { this.loading = false; this.toast.error('Failed'); }
    });
  }
}
