import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category, CategoryForCreate, CategoryForUpdate } from '../models/category.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;
  constructor(private http: HttpClient) {}

  getAll(pageNumber = 1, pageSize = 5, search = ''): Observable<PaginatedResponse<Category>> {
    let params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    if (search) params = params.set('search', search);
    return this.http.get<PaginatedResponse<Category>>(this.apiUrl, { params });
  }
  getAllNoPagination(): Observable<Category[]> { return this.http.get<Category[]>(`${this.apiUrl}/all`); }
  getById(id: number): Observable<Category> { return this.http.get<Category>(`${this.apiUrl}/${id}`); }
  create(category: CategoryForCreate): Observable<Category> { return this.http.post<Category>(this.apiUrl, category); }
  update(id: number, category: CategoryForUpdate): Observable<Category> { return this.http.put<Category>(`${this.apiUrl}/${id}`, category); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
}
