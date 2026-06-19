export type NotificationCategory = "orders" | "reviews" | "staff" | "general";

export type AdminNotificationType =
  | "order"
  | "review"
  | "staff"
  | "security"
  | "contact"
  | "subscriber";

export interface IAdminNotification {
  _id: string;
  type: AdminNotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  link?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  isRead: boolean;
}

export interface INotificationResponse {
  success: boolean;
  data: IAdminNotification[];
  unreadTotal: number;
  unreadByCategory: Record<NotificationCategory, number>;
}
