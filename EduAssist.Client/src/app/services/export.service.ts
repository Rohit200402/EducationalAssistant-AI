import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExportService {
  private apiUrl = `${environment.apiUrl}/export`;
  constructor(private http: HttpClient) {}

  exportResponse(id: number): void {
    this.http.get(`${this.apiUrl}/response/${id}`, { responseType: 'text' }).subscribe(html => {
      this.openHtml(html);
    });
  }

  exportResponses(ids: number[]): void {
    const idsParam = ids.join(',');
    this.http.get(`${this.apiUrl}/responses?ids=${idsParam}`, { responseType: 'text' }).subscribe(html => {
      this.openHtml(html);
    });
  }

  exportConversation(id: number): void {
    this.http.get(`${this.apiUrl}/conversation/${id}`, { responseType: 'text' }).subscribe(html => {
      this.openHtml(html);
    });
  }

  private openHtml(html: string): void {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (win) {
      win.onload = () => URL.revokeObjectURL(url);
    }
  }
}
