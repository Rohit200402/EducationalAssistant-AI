import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserNavbarComponent } from '../../shared/user-navbar/user-navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ExportButtonComponent } from '../../shared/export-button/export-button.component';
import { ConversationService } from '../../../services/conversation.service';
import { CategoryService } from '../../../services/category.service';
import { ToastService } from '../../../services/toast.service';
import { ConversationDetail, ConversationMessage } from '../../../models/conversation.model';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UserNavbarComponent, FooterComponent, ExportButtonComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  conversation: ConversationDetail | null = null;
  messages: ConversationMessage[] = [];
  newMessage = '';
  sending = false;
  isNew = false;
  categories: Category[] = [];
  newTitle = '';
  selectedCategoryId = 0;
  loading = true;

  constructor(private conversationService: ConversationService, private categoryService: CategoryService, private route: ActivatedRoute, private router: Router, private toast: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.isNew = true;
      this.loading = false;
      this.categoryService.getAllNoPagination().subscribe(c => { this.categories = c; this.cdr.detectChanges(); });
    } else {
      this.loadConversation(+id!);
    }
  }

  loadConversation(id: number): void {
    this.conversationService.getById(id).subscribe({
      next: (conv) => { this.conversation = conv; this.messages = conv.messages; this.loading = false; this.cdr.detectChanges(); setTimeout(() => this.scrollToBottom(), 100); },
      error: () => { this.loading = false; this.toast.error('Conversation not found'); this.router.navigate(['/user/conversations']); }
    });
  }

  createConversation(): void {
    if (!this.newTitle.trim() || !this.selectedCategoryId) { this.toast.warning('Enter a title and select a category'); return; }
    this.conversationService.create({ title: this.newTitle, categoryId: this.selectedCategoryId }).subscribe({
      next: (conv) => { this.conversation = conv; this.messages = conv.messages; this.isNew = false; this.cdr.detectChanges(); this.router.navigate(['/user/chat', conv.conversationId], { replaceUrl: true }); },
      error: () => this.toast.error('Failed to create conversation')
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.conversation || this.sending) return;
    this.sending = true;
    const content = this.newMessage;
    this.messages.push({ messageId: 0, role: 'user', content, createdAt: new Date().toISOString() });
    this.newMessage = '';
    this.scrollToBottom();
    this.conversationService.sendMessage(this.conversation.conversationId, content).subscribe({
      next: (msg) => { this.messages.push(msg); this.sending = false; this.cdr.detectChanges(); this.scrollToBottom(); },
      error: () => { this.sending = false; this.toast.error('Failed to get response'); }
    });
  }

  scrollToBottom(): void {
    setTimeout(() => { if (this.messagesContainer) this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight; }, 50);
  }
}
