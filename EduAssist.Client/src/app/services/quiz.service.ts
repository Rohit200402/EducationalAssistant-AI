import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { QuizList, QuizDetail, QuizGenerate, QuizSubmit, QuizResult, AdminQuizList, QuizStats } from '../models/quiz.model';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private apiUrl = `${environment.apiUrl}/quiz`;
  constructor(private http: HttpClient) {}

  generate(dto: QuizGenerate): Observable<QuizDetail> {
    return this.http.post<QuizDetail>(`${this.apiUrl}/generate`, dto);
  }

  getAll(pageNumber = 1, pageSize = 10): Observable<PaginatedResponse<QuizList>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    return this.http.get<PaginatedResponse<QuizList>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<QuizDetail> {
    return this.http.get<QuizDetail>(`${this.apiUrl}/${id}`);
  }

  submit(quizId: number, dto: QuizSubmit): Observable<QuizResult> {
    return this.http.post<QuizResult>(`${this.apiUrl}/${quizId}/submit`, dto);
  }

  getResults(quizId: number): Observable<QuizResult> {
    return this.http.get<QuizResult>(`${this.apiUrl}/${quizId}/results`);
  }

  getAllAdmin(pageNumber = 1, pageSize = 10): Observable<PaginatedResponse<AdminQuizList>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    return this.http.get<PaginatedResponse<AdminQuizList>>(`${this.apiUrl}/all`, { params });
  }

  getStats(): Observable<QuizStats> {
    return this.http.get<QuizStats>(`${this.apiUrl}/stats`);
  }
}
