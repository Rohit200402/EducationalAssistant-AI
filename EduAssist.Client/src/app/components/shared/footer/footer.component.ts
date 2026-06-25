import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `<footer class="footer"><div class="container text-center"><span class="text-muted">&copy; 2025 EduAssist - AI Educational Assistant. All rights reserved.</span></div></footer>`,
  styles: [`.footer { padding: 1.5rem 0; margin-top: 2rem; border-top: 1px solid #e2e8f0; background: white; }`]
})
export class FooterComponent {}
