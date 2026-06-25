import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, UserForCreate, UserForUpdate, UserProfileUpdate } from '../models/user.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}

  getAll(pageNumber = 1, pageSize = 5, search = ''): Observable<PaginatedResponse<User>> {
    let params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    if (search) params = params.set('search', search);
    return this.http.get<PaginatedResponse<User>>(this.apiUrl, { params });
  }
  getById(id: string): Observable<User> { return this.http.get<User>(`${this.apiUrl}/${id}`); }
  create(user: UserForCreate): Observable<User> { return this.http.post<User>(this.apiUrl, user); }
  update(id: string, user: UserForUpdate): Observable<User> { return this.http.put<User>(`${this.apiUrl}/${id}`, user); }
  delete(id: string): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
  getProfile(): Observable<User> { return this.http.get<User>(`${this.apiUrl}/profile`); }
  updateProfile(profile: UserProfileUpdate): Observable<User> { return this.http.put<User>(`${this.apiUrl}/profile`, profile); }
}
