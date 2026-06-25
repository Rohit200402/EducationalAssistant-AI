import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { userGuard } from './guards/user.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/auth/landing-page/landing-page.component').then(m => m.LandingPageComponent) },
  { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent) },
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
  { path: 'admin/requests', loadComponent: () => import('./components/admin/view-all-requests/view-all-requests.component').then(m => m.ViewAllRequestsComponent), canActivate: [adminGuard] },
  { path: 'admin/responses', loadComponent: () => import('./components/admin/view-all-responses/view-all-responses.component').then(m => m.ViewAllResponsesComponent), canActivate: [adminGuard] },
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
  { path: 'user/profile', loadComponent: () => import('./components/user/edit-profile/edit-profile.component').then(m => m.EditProfileComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
