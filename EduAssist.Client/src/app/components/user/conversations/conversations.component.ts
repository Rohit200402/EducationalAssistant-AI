import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserNavbarComponent } from '../../shared/user-navbar/user-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ConversationService } from '../../../services/conversation.service';
import { ToastService } from '../../../services/toast.service';
import { ConversationList } from '../../../models/conversation.model';

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [CommonModule, RouterModule, UserNavbarComponent, FooterComponent],
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css']
})
export class ConversationsComponent implements OnInit {
  conversations: ConversationList[] = [];
  loading = true;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 0;

  constructor(private conversationService: ConversationService, private router: Router, private toast: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.loadConversations(); }

  loadConversations(): void {
    this.loading = true;
    this.conversationService.getAll(this.pageNumber, this.pageSize).subscribe({
      next: (res) => { this.conversations = res.items; this.totalPages = res.totalPages; this.loading = false; this.cdr.detectChanges(); },
      error: () => { this.loading = false; }
    });
  }

  openChat(id: number): void { this.router.navigate(['/user/chat', id]); }
  newConversation(): void { this.router.navigate(['/user/chat/new']); }

  deleteConversation(event: Event, id: number): void {
    event.stopPropagation();
    if (confirm('Delete this conversation?')) {
      this.conversationService.delete(id).subscribe({
        next: () => { this.toast.success('Conversation deleted'); this.loadConversations(); this.cdr.detectChanges(); },
        error: () => this.toast.error('Failed to delete')
      });
    }
  }

  changePage(page: number): void { this.pageNumber = page; this.loadConversations(); }
}
