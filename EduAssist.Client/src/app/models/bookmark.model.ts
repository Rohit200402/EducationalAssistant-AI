export interface Bookmark { bookmarkId: number; userId: string; aiResponseId: number; bookmarkedOn: string; notes: string; aiResponse?: BookmarkAIResponse; }
export interface BookmarkForCreate { aiResponseId: number; notes: string; }
export interface BookmarkForUpdate { bookmarkId: number; notes: string; }
export interface BookmarkAIResponse { aiResponseId: number; response: string; createdAt: string; query?: string; categoryName?: string; }
