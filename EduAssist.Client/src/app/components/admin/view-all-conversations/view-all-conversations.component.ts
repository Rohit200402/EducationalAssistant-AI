import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminNavbarComponent } from '../../shared/admin-navbar/admin-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { SearchComponent } from '../../shared/search/search.component';
import { ConversationService } from '../../../services/conversation.service';
import { AdminConversationList } from '../../../models/conversation.model';

@Component({
  selector: 'app-view-all-conversations',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminNavbarComponent, FooterComponent, PaginationComponent, SearchComponent],
  templateUrl: './view-all-conversations.component.html',
  styleUrls: ['./view-all-conversations.component.css']
})
export class ViewAllConversationsComponent implements OnInit {
  conversations: AdminConversationList[] = [];
  loading = true;
  currentPage = 1;
  totalPages = 1;
  totalCount = 0;
  search = '';

  constructor(private conversationService: ConversationService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.conversationService.getAllAdmin(this.currentPage, 10, this.search).subscribe({
      next: (res) => { this.conversations = res.items; this.totalPages = res.totalPages; this.totalCount = res.totalCount; this.loading = false; this.cdr.detectChanges(); },
      error: () => { this.loading = false; }
    });
  }

  onSearch(term: string): void { this.search = term; this.currentPage = 1; this.load(); }
  onPageChange(page: number): void { this.currentPage = page; this.load(); }
}
