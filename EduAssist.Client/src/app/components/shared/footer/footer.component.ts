import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="app-footer">
      <div class="footer-content">
        <span class="footer-text">&copy; 2025 EduAssist</span>
        <span class="footer-separator">&#183;</span>
        <span class="footer-text">AI Educational Assistant</span>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      padding: var(--space-6) var(--space-4);
      margin-top: var(--space-8);
      margin-left: var(--sidebar-width);
      border-top: 1px solid var(--color-neutral-100);
    }
    .footer-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
    }
    .footer-text {
      font-size: var(--text-sm);
      color: var(--color-neutral-400);
      font-weight: var(--font-normal);
    }
    .footer-separator {
      color: var(--color-neutral-300);
      font-size: var(--text-lg);
    }
    @media (max-width: 768px) {
      .app-footer {
        margin-left: 0;
      }
    }
  `]
})
export class FooterComponent {}
