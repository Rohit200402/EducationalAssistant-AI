import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AIResponse } from '../models/ai-response.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class AIResponseService {
  private apiUrl = `${environment.apiUrl}/airesponses`;
  constructor(private http: HttpClient) {}

  getMyResponses(pageNumber = 1, pageSize = 5, search = ''): Observable<PaginatedResponse<AIResponse>> {
    let params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    if (search) params = params.set('search', search);
    return this.http.get<PaginatedResponse<AIResponse>>(`${this.apiUrl}/my-responses`, { params });
  }
  getAll(pageNumber = 1, pageSize = 5, search = ''): Observable<PaginatedResponse<AIResponse>> {
    let params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    if (search) params = params.set('search', search);
    return this.http.get<PaginatedResponse<AIResponse>>(this.apiUrl, { params });
  }
  getByRequest(requestId: number): Observable<AIResponse[]> { return this.http.get<AIResponse[]>(`${this.apiUrl}/by-request/${requestId}`); }
}
