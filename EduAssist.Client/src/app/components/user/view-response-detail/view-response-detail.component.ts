import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserNavbarComponent } from '../../shared/user-navbar/user-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ExportButtonComponent } from '../../shared/export-button/export-button.component';
import { UserRequestService } from '../../../services/user-request.service';
import { AIResponseService } from '../../../services/ai-response.service';
import { BookmarkService } from '../../../services/bookmark.service';
import { ToastService } from '../../../services/toast.service';
import { UserRequest } from '../../../models/user-request.model';
import { AIResponse } from '../../../models/ai-response.model';

@Component({ selector: 'app-view-response-detail', standalone: true, imports: [CommonModule, RouterModule, UserNavbarComponent, FooterComponent, ExportButtonComponent], templateUrl: './view-response-detail.component.html', styleUrls: ['./view-response-detail.component.css'] })
export class ViewResponseDetailComponent implements OnInit {
  request: UserRequest | null = null; responses: AIResponse[] = []; loading = true; regenerating = false;
  constructor(private route: ActivatedRoute, private requestService: UserRequestService, private aiResponseService: AIResponseService, private bookmarkService: BookmarkService, private toast: ToastService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.requestService.getById(id).subscribe(r => { this.request = r; this.cdr.detectChanges(); });
    this.aiResponseService.getByRequest(id).subscribe({ next: (res) => { this.responses = res; this.loading = false; this.cdr.detectChanges(); }, error: () => { this.loading = false; } });
  }
  regenerate(): void {
    if (!this.request) return;
    this.regenerating = true;
    this.requestService.regenerate(this.request.userRequestId).subscribe({
      next: (res) => { this.responses.unshift({ aiResponseId: res.aiResponseId, response: res.response, createdAt: res.createdAt, userRequestId: this.request!.userRequestId }); this.regenerating = false; this.toast.success('New response generated!'); this.cdr.detectChanges(); },
      error: () => { this.regenerating = false; this.toast.error('Failed to regenerate.'); }
    });
  }
  bookmark(responseId: number): void {
    this.bookmarkService.create({ aiResponseId: responseId, notes: '' }).subscribe({
      next: () => this.toast.success('Bookmarked!'),
      error: (err) => this.toast.error(err.error?.message || 'Failed')
    });
  }
}
