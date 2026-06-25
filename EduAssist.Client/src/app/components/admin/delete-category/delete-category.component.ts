import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CategoryService } from '../../../services/category.service';
import { ToastService } from '../../../services/toast.service';
import { Category } from '../../../models/category.model';

@Component({ selector: 'app-delete-category', standalone: true, imports: [CommonModule, RouterModule, AdminNavbarComponent, FooterComponent], templateUrl: './delete-category.component.html', styleUrls: ['./delete-category.component.css'] })
export class DeleteCategoryComponent implements OnInit {
  category: Category | null = null;
  loading = false;
  categoryId = 0;
  constructor(private categoryService: CategoryService, private route: ActivatedRoute, private router: Router, private toast: ToastService) {}
  ngOnInit(): void { this.categoryId = +this.route.snapshot.paramMap.get('id')!; this.categoryService.getById(this.categoryId).subscribe(c => this.category = c); }
  confirm(): void {
    this.loading = true;
    this.categoryService.delete(this.categoryId).subscribe({ next: () => { this.toast.success('Category deleted!'); this.router.navigate(['/admin/categories']); }, error: () => { this.loading = false; this.toast.error('Failed'); } });
  }
}
