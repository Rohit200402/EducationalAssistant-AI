import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ConversationList, ConversationDetail, ConversationCreate, ConversationMessage, AdminConversationList } from '../models/conversation.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private apiUrl = `${environment.apiUrl}/conversations`;
  constructor(private http: HttpClient) {}

  getAll(pageNumber = 1, pageSize = 10): Observable<PaginatedResponse<ConversationList>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    return this.http.get<PaginatedResponse<ConversationList>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ConversationDetail> {
    return this.http.get<ConversationDetail>(`${this.apiUrl}/${id}`);
  }

  create(dto: ConversationCreate): Observable<ConversationDetail> {
    return this.http.post<ConversationDetail>(this.apiUrl, dto);
  }

  sendMessage(conversationId: number, content: string): Observable<ConversationMessage> {
    return this.http.post<ConversationMessage>(`${this.apiUrl}/${conversationId}/messages`, { content });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllAdmin(pageNumber = 1, pageSize = 10, search = ''): Observable<PaginatedResponse<AdminConversationList>> {
    let params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    if (search) { params = params.set('search', search); }
    return this.http.get<PaginatedResponse<AdminConversationList>>(`${this.apiUrl}/all`, { params });
  }

  getByIdAdmin(id: number): Observable<ConversationDetail> {
    return this.http.get<ConversationDetail>(`${this.apiUrl}/all/${id}`);
  }
}
