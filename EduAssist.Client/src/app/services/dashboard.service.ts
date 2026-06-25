import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AdminDashboardStats, UserDashboardStats } from '../models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;
  constructor(private http: HttpClient) {}
  getAdminStats(): Observable<AdminDashboardStats> { return this.http.get<AdminDashboardStats>(`${this.apiUrl}/admin`); }
  getUserStats(): Observable<UserDashboardStats> { return this.http.get<UserDashboardStats>(`${this.apiUrl}/user`); }
}
