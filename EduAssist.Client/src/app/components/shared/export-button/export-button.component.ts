import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportService } from '../../../services/export.service';

@Component({
  selector: 'app-export-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './export-button.component.html',
  styleUrls: ['./export-button.component.css']
})
export class ExportButtonComponent {
  @Input() responseId?: number;
  @Input() conversationId?: number;
  @Input() label = 'Export';
  @Input() btnClass = 'btn-outline-secondary btn-sm';

  constructor(private exportService: ExportService) {}

  export(): void {
    if (this.responseId) {
      this.exportService.exportResponse(this.responseId);
    } else if (this.conversationId) {
      this.exportService.exportConversation(this.conversationId);
    }
  }
}
