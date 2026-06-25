import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserRequest, UserRequestForCreate, AIResponseBrief } from '../models/user-request.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class UserRequestService {
  private apiUrl = `${environment.apiUrl}/userrequests`;
  constructor(private http: HttpClient) {}

  create(request: UserRequestForCreate): Observable<UserRequest> { return this.http.post<UserRequest>(this.apiUrl, request); }
  getMyRequests(pageNumber = 1, pageSize = 5, search = ''): Observable<PaginatedResponse<UserRequest>> {
    let params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    if (search) params = params.set('search', search);
    return this.http.get<PaginatedResponse<UserRequest>>(`${this.apiUrl}/my-requests`, { params });
  }
  getAll(pageNumber = 1, pageSize = 5, search = ''): Observable<PaginatedResponse<UserRequest>> {
    let params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    if (search) params = params.set('search', search);
    return this.http.get<PaginatedResponse<UserRequest>>(this.apiUrl, { params });
  }
  getById(id: number): Observable<UserRequest> { return this.http.get<UserRequest>(`${this.apiUrl}/${id}`); }
  regenerate(id: number): Observable<AIResponseBrief> { return this.http.post<AIResponseBrief>(`${this.apiUrl}/${id}/regenerate`, {}); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}
