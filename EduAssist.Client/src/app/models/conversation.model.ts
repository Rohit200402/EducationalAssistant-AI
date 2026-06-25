export interface ConversationList {
  conversationId: number;
  title: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  messageCount: number;
}

export interface ConversationDetail {
  conversationId: number;
  title: string;
  categoryName: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  messages: ConversationMessage[];
}

export interface ConversationMessage {
  messageId: number;
  role: string;
  content: string;
  createdAt: string;
}

export interface ConversationCreate {
  title: string;
  categoryId: number;
}

export interface ConversationSendMessage {
  content: string;
}

export interface AdminConversationList {
  conversationId: number;
  title: string;
  userName: string;
  categoryName: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
