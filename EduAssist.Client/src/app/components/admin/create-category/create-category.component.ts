import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CategoryService } from '../../../services/category.service';
import { ToastService } from '../../../services/toast.service';

@Component({ selector: 'app-create-category', standalone: true, imports: [CommonModule, FormsModule, RouterModule, AdminNavbarComponent, FooterComponent], templateUrl: './create-category.component.html', styleUrls: ['./create-category.component.css'] })
export class CreateCategoryComponent {
  subjectName = '';
  description = '';
  systemPrompt = '';
  loading = false;
  constructor(private categoryService: CategoryService, private router: Router, private toast: ToastService) {}
  submit(): void {
    if (!this.subjectName.trim()) { this.toast.warning('Enter a category name.'); return; }
    this.loading = true;
    this.categoryService.create({ subjectName: this.subjectName, description: this.description, systemPrompt: this.systemPrompt }).subscribe({
      next: () => { this.toast.success('Category created!'); this.router.navigate(['/admin/categories']); },
      error: (err) => { this.loading = false; this.toast.error(err.error?.message || 'Failed'); }
    });
  }
}
