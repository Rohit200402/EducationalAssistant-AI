import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StudyGoalDto, StudyGoalForUpdate } from '../models/study-goal.model';

@Injectable({ providedIn: 'root' })
export class StudyGoalService {
  private apiUrl = `${environment.apiUrl}/studygoal`;
  constructor(private http: HttpClient) {}

  get(): Observable<StudyGoalDto> {
    return this.http.get<StudyGoalDto>(this.apiUrl);
  }

  update(dto: StudyGoalForUpdate): Observable<StudyGoalDto> {
    return this.http.put<StudyGoalDto>(this.apiUrl, dto);
  }
}
