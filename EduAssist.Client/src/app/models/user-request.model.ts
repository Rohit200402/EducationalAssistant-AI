export interface UserRequest { userRequestId: number; query: string; categoryId: number; categoryName?: string; userId: string; userName?: string; requestedOn: string; aiResponse?: AIResponseBrief; }
export interface UserRequestForCreate { query: string; categoryId: number; }
export interface AIResponseBrief { aiResponseId: number; response: string; createdAt: string; }
