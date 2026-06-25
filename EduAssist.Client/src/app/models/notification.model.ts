export interface NotificationDto {
  notificationId: number;
  userId: string | null;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: string;
}

export interface NotificationForCreate {
  title: string;
  message: string;
  type: string;
}
