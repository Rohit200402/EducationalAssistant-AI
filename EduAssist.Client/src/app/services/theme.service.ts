import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<string>(this.getStoredTheme());
  theme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.getStoredTheme());
  }

  toggleTheme(): void {
    const current = this.themeSubject.value;
    const newTheme = current === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme: string): void {
    localStorage.setItem('theme', theme);
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }

  getTheme(): string {
    return this.themeSubject.value;
  }

  private getStoredTheme(): string {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  }

  private applyTheme(theme: string): void {
    if (typeof document !== 'undefined') {
      if (theme === 'light') {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
      } else {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
      }
    }
  }
}
