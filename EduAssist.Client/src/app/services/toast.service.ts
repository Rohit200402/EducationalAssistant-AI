import { Injectable } from '@angular/core';

export interface Toast { id: number; message: string; type: 'success' | 'error' | 'warning'; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];
  private nextId = 0;

  show(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
    const id = this.nextId++;
    this.toasts.push({ id, message, type });
    setTimeout(() => this.remove(id), 4000);
  }

  success(message: string): void { this.show(message, 'success'); }
  error(message: string): void { this.show(message, 'error'); }
  warning(message: string): void { this.show(message, 'warning'); }
  remove(id: number): void { this.toasts = this.toasts.filter(t => t.id !== id); }
}
