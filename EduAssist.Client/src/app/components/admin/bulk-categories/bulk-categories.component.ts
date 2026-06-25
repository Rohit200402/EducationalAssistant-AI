import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-bulk-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AdminNavbarComponent, FooterComponent],
  templateUrl: './bulk-categories.component.html',
  styleUrls: ['./bulk-categories.component.css']
})
export class BulkCategoriesComponent {
  jsonInput = '';
  loading = false;
  createdCount = 0;

  constructor(private http: HttpClient, private toast: ToastService, private cdr: ChangeDetectorRef) {}

  submit(): void {
    if (!this.jsonInput.trim()) { this.toast.warning('Please enter JSON data.'); return; }
    let categories: any[];
    try {
      categories = JSON.parse(this.jsonInput);
      if (!Array.isArray(categories)) throw new Error('Must be an array');
    } catch (e) {
      this.toast.error('Invalid JSON. Must be an array of objects with subjectName, description, systemPrompt fields.');
      return;
    }
    this.loading = true;
    this.http.post<any[]>(`${environment.apiUrl}/categories/bulk`, categories).subscribe({
      next: (result) => {
        this.loading = false;
        this.createdCount = result.length;
        this.toast.success(`${result.length} categories created successfully!`);
        this.jsonInput = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.toast.error(err.error?.message || 'Bulk creation failed.');
      }
    });
  }
}
