import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RatingDto, RatingForCreate, RatingAggregateDto } from '../models/rating.model';

@Injectable({ providedIn: 'root' })
export class RatingService {
  private apiUrl = `${environment.apiUrl}/ratings`;
  constructor(private http: HttpClient) {}

  rate(dto: RatingForCreate): Observable<RatingDto> {
    return this.http.post<RatingDto>(this.apiUrl, dto);
  }

  getForResponse(aiResponseId: number): Observable<RatingAggregateDto> {
    return this.http.get<RatingAggregateDto>(`${this.apiUrl}/response/${aiResponseId}`);
  }
}
