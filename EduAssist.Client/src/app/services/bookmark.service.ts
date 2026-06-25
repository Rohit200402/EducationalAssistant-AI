import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Bookmark, BookmarkForCreate, BookmarkForUpdate } from '../models/bookmark.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class BookmarkService {
  private apiUrl = `${environment.apiUrl}/bookmarks`;
  constructor(private http: HttpClient) {}

  getAll(pageNumber = 1, pageSize = 5, search = ''): Observable<PaginatedResponse<Bookmark>> {
    let params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    if (search) params = params.set('search', search);
    return this.http.get<PaginatedResponse<Bookmark>>(this.apiUrl, { params });
  }
  getById(id: number): Observable<Bookmark> { return this.http.get<Bookmark>(`${this.apiUrl}/${id}`); }
  create(bookmark: BookmarkForCreate): Observable<Bookmark> { return this.http.post<Bookmark>(this.apiUrl, bookmark); }
  update(id: number, bookmark: BookmarkForUpdate): Observable<Bookmark> { return this.http.put<Bookmark>(`${this.apiUrl}/${id}`, bookmark); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/${id}`); }
  check(aiResponseId: number): Observable<{ isBookmarked: boolean; bookmarkId?: number }> { return this.http.get<{ isBookmarked: boolean; bookmarkId?: number }>(`${this.apiUrl}/check/${aiResponseId}`); }
}
