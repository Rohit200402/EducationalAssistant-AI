export interface Category { categoryId: number; subjectName: string; description: string; systemPrompt: string; }
export interface CategoryForCreate { subjectName: string; description?: string; systemPrompt?: string; }
export interface CategoryForUpdate { categoryId: number; subjectName: string; description?: string; systemPrompt?: string; }
