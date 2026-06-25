import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SearchResult } from '../models/search.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private apiUrl = `${environment.apiUrl}/search`;
  constructor(private http: HttpClient) {}

  search(query: string, type?: string, categoryId?: number, pageNumber = 1, pageSize = 5): Observable<PaginatedResponse<SearchResult>> {
    let params = new HttpParams().set('query', query).set('pageNumber', pageNumber).set('pageSize', pageSize);
    if (type) params = params.set('type', type);
    if (categoryId) params = params.set('categoryId', categoryId);
    return this.http.get<PaginatedResponse<SearchResult>>(this.apiUrl, { params });
  }
}
