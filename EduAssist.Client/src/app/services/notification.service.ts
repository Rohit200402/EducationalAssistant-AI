import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { NotificationDto, NotificationForCreate } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;
  constructor(private http: HttpClient) {}

  getUnread(): Observable<NotificationDto[]> {
    return this.http.get<NotificationDto[]>(this.apiUrl);
  }

  markRead(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/mark-read/${id}`, {});
  }

  broadcast(dto: NotificationForCreate): Observable<NotificationDto> {
    return this.http.post<NotificationDto>(`${this.apiUrl}/broadcast`, dto);
  }
}
