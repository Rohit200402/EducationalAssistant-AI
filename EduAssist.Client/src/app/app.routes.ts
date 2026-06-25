import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { userGuard } from './guards/user.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/auth/landing-page/landing-page.component').then(m => m.LandingPageComponent) },
  { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'forgot-password', loadComponent: () => import('./components/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('./components/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
  // Admin routes
  { path: 'admin/dashboard', loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent), canActivate: [adminGuard] },
  { path: 'admin/users', loadComponent: () => import('./components/admin/view-users/view-users.component').then(m => m.ViewUsersComponent), canActivate: [adminGuard] },
  { path: 'admin/users/create', loadComponent: () => import('./components/admin/create-user/create-user.component').then(m => m.CreateUserComponent), canActivate: [adminGuard] },
  { path: 'admin/users/edit/:id', loadComponent: () => import('./components/admin/edit-user/edit-user.component').then(m => m.EditUserComponent), canActivate: [adminGuard] },
  { path: 'admin/users/delete/:id', loadComponent: () => import('./components/admin/delete-user/delete-user.component').then(m => m.DeleteUserComponent), canActivate: [adminGuard] },
  { path: 'admin/categories', loadComponent: () => import('./components/admin/view-categories/view-categories.component').then(m => m.ViewCategoriesComponent), canActivate: [adminGuard] },
  { path: 'admin/categories/create', loadComponent: () => import('./components/admin/create-category/create-category.component').then(m => m.CreateCategoryComponent), canActivate: [adminGuard] },
  { path: 'admin/categories/edit/:id', loadComponent: () => import('./components/admin/edit-category/edit-category.component').then(m => m.EditCategoryComponent), canActivate: [adminGuard] },
  { path: 'admin/categories/delete/:id', loadComponent: () => import('./components/admin/delete-category/delete-category.component').then(m => m.DeleteCategoryComponent), canActivate: [adminGuard] },
  { path: 'admin/categories/bulk', loadComponent: () => import('./components/admin/bulk-categories/bulk-categories.component').then(m => m.BulkCategoriesComponent), canActivate: [adminGuard] },
  { path: 'admin/notifications/create', loadComponent: () => import('./components/admin/create-notification/create-notification.component').then(m => m.CreateNotificationComponent), canActivate: [adminGuard] },
  { path: 'admin/requests', loadComponent: () => import('./components/admin/view-all-requests/view-all-requests.component').then(m => m.ViewAllRequestsComponent), canActivate: [adminGuard] },
  { path: 'admin/responses', loadComponent: () => import('./components/admin/view-all-responses/view-all-responses.component').then(m => m.ViewAllResponsesComponent), canActivate: [adminGuard] },
  { path: 'admin/conversations', loadComponent: () => import('./components/admin/view-all-conversations/view-all-conversations.component').then(m => m.ViewAllConversationsComponent), canActivate: [adminGuard] },
  { path: 'admin/quiz-stats', loadComponent: () => import('./components/admin/view-quiz-stats/view-quiz-stats.component').then(m => m.ViewQuizStatsComponent), canActivate: [adminGuard] },
  // User routes
  { path: 'user/dashboard', loadComponent: () => import('./components/user/user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent), canActivate: [userGuard] },
  { path: 'user/ask', loadComponent: () => import('./components/user/ask-question/ask-question.component').then(m => m.AskQuestionComponent), canActivate: [userGuard] },
  { path: 'user/my-requests', loadComponent: () => import('./components/user/my-requests/my-requests.component').then(m => m.MyRequestsComponent), canActivate: [userGuard] },
  { path: 'user/my-responses', loadComponent: () => import('./components/user/my-responses/my-responses.component').then(m => m.MyResponsesComponent), canActivate: [userGuard] },
  { path: 'user/responses/:id', loadComponent: () => import('./components/user/view-response-detail/view-response-detail.component').then(m => m.ViewResponseDetailComponent), canActivate: [userGuard] },
  { path: 'user/bookmarks', loadComponent: () => import('./components/user/bookmarks/bookmarks.component').then(m => m.BookmarksComponent), canActivate: [userGuard] },
  { path: 'user/bookmarks/add/:responseId', loadComponent: () => import('./components/user/add-bookmark/add-bookmark.component').then(m => m.AddBookmarkComponent), canActivate: [userGuard] },
  { path: 'user/bookmarks/edit/:id', loadComponent: () => import('./components/user/edit-bookmark/edit-bookmark.component').then(m => m.EditBookmarkComponent), canActivate: [userGuard] },
  { path: 'user/progress', loadComponent: () => import('./components/user/progress-tracking/progress-tracking.component').then(m => m.ProgressTrackingComponent), canActivate: [userGuard] },
  { path: 'user/leaderboard', loadComponent: () => import('./components/user/leaderboard/leaderboard.component').then(m => m.LeaderboardComponent), canActivate: [userGuard] },
  { path: 'user/study-planner', loadComponent: () => import('./components/user/study-planner/study-planner.component').then(m => m.StudyPlannerComponent), canActivate: [userGuard] },
  { path: 'user/profile', loadComponent: () => import('./components/user/edit-profile/edit-profile.component').then(m => m.EditProfileComponent), canActivate: [authGuard] },
  // Search
  { path: 'user/search', loadComponent: () => import('./components/user/search-results/search-results.component').then(m => m.SearchResultsComponent), canActivate: [userGuard] },
  // Conversations
  { path: 'user/conversations', loadComponent: () => import('./components/user/conversations/conversations.component').then(m => m.ConversationsComponent), canActivate: [userGuard] },
  { path: 'user/chat/new', loadComponent: () => import('./components/user/chat/chat.component').then(m => m.ChatComponent), canActivate: [userGuard] },
  { path: 'user/chat/:id', loadComponent: () => import('./components/user/chat/chat.component').then(m => m.ChatComponent), canActivate: [userGuard] },
  // Export
  { path: 'user/export', loadComponent: () => import('./components/user/export-responses/export-responses.component').then(m => m.ExportResponsesComponent), canActivate: [userGuard] },
  // Quiz
  { path: 'user/quiz', loadComponent: () => import('./components/user/quiz-list/quiz-list.component').then(m => m.QuizListComponent), canActivate: [userGuard] },
  { path: 'user/quiz/generate', loadComponent: () => import('./components/user/generate-quiz/generate-quiz.component').then(m => m.GenerateQuizComponent), canActivate: [userGuard] },
  { path: 'user/quiz/:id/results', loadComponent: () => import('./components/user/quiz-results/quiz-results.component').then(m => m.QuizResultsComponent), canActivate: [userGuard] },
  { path: 'user/quiz/:id', loadComponent: () => import('./components/user/take-quiz/take-quiz.component').then(m => m.TakeQuizComponent), canActivate: [userGuard] },
  { path: '**', redirectTo: '' }
];
