import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProgressStats } from '../models/progress.model';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private apiUrl = `${environment.apiUrl}/progress`;
  constructor(private http: HttpClient) {}
  getProgress(): Observable<ProgressStats> { return this.http.get<ProgressStats>(this.apiUrl); }
}
