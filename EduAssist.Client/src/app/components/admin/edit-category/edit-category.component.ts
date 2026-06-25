import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CategoryService } from '../../../services/category.service';
import { ToastService } from '../../../services/toast.service';

@Component({ selector: 'app-edit-category', standalone: true, imports: [CommonModule, FormsModule, RouterModule, AdminNavbarComponent, FooterComponent], templateUrl: './edit-category.component.html', styleUrls: ['./edit-category.component.css'] })
export class EditCategoryComponent implements OnInit {
  categoryId = 0;
  subjectName = '';
  description = '';
  systemPrompt = '';
  loading = false;
  constructor(private categoryService: CategoryService, private route: ActivatedRoute, private router: Router, private toast: ToastService) {}
  ngOnInit(): void {
    this.categoryId = +this.route.snapshot.paramMap.get('id')!;
    this.categoryService.getById(this.categoryId).subscribe(c => { this.subjectName = c.subjectName; this.description = c.description || ''; this.systemPrompt = c.systemPrompt || ''; });
  }
  submit(): void {
    this.loading = true;
    this.categoryService.update(this.categoryId, { categoryId: this.categoryId, subjectName: this.subjectName, description: this.description, systemPrompt: this.systemPrompt }).subscribe({
      next: () => { this.toast.success('Category updated!'); this.router.navigate(['/admin/categories']); },
      error: (err) => { this.loading = false; this.toast.error(err.error?.message || 'Failed'); }
    });
  }
}
