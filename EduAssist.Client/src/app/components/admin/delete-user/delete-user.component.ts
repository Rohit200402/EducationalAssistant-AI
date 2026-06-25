import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminNavbarComponent, FooterComponent],
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {
  user: User | null = null;
  loading = false;
  userId = '';

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router, private toast: ToastService) {}
  ngOnInit(): void { this.userId = this.route.snapshot.paramMap.get('id') || ''; this.userService.getById(this.userId).subscribe(user => this.user = user); }
  confirm(): void {
    this.loading = true;
    this.userService.delete(this.userId).subscribe({ next: () => { this.toast.success('User deactivated!'); this.router.navigate(['/admin/users']); }, error: () => { this.loading = false; this.toast.error('Failed'); } });
  }
}
