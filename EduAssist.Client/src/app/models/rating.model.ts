export interface RatingDto {
  ratingId: number;
  userId: string;
  aiResponseId: number;
  value: number;
  createdAt: string;
}

export interface RatingForCreate {
  aiResponseId: number;
  value: number;
}

export interface RatingAggregateDto {
  averageRating: number;
  totalRatings: number;
  userRating: number | null;
}
