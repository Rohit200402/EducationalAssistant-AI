import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserNavbarComponent } from '../../shared/user-navbar/user-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { AIResponseService } from '../../../services/ai-response.service';
import { ExportService } from '../../../services/export.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-export-responses',
  standalone: true,
  imports: [CommonModule, RouterModule, UserNavbarComponent, FooterComponent],
  templateUrl: './export-responses.component.html',
  styleUrls: ['./export-responses.component.css']
})
export class ExportResponsesComponent implements OnInit {
  responses: any[] = [];
  selectedIds: Set<number> = new Set();
  loading = true;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;

  constructor(private aiResponseService: AIResponseService, private exportService: ExportService, private toast: ToastService) {}

  ngOnInit(): void { this.loadResponses(); }

  loadResponses(): void {
    this.loading = true;
    this.aiResponseService.getMyResponses(this.pageNumber, this.pageSize).subscribe({
      next: (res) => { this.responses = res.items; this.totalPages = res.totalPages; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  toggleSelection(id: number): void {
    if (this.selectedIds.has(id)) this.selectedIds.delete(id);
    else this.selectedIds.add(id);
  }

  isSelected(id: number): boolean { return this.selectedIds.has(id); }

  selectAll(): void {
    if (this.selectedIds.size === this.responses.length) this.selectedIds.clear();
    else this.responses.forEach(r => this.selectedIds.add(r.aiResponseId));
  }

  exportSelected(): void {
    if (this.selectedIds.size === 0) { this.toast.warning('Select at least one response'); return; }
    this.exportService.exportResponses(Array.from(this.selectedIds));
  }

  changePage(page: number): void { this.pageNumber = page; this.loadResponses(); }
}
