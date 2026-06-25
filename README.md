# EduAssist - AI-Powered Educational Assistant

A full-stack AI-powered education assistant built with .NET 10 Web API and Angular 18.

## Features

- **AI-Powered Q&A**: Ask educational questions and get AI-generated responses
- **Category Management**: Organize questions by subject categories
- **Bookmarks**: Save and annotate helpful responses
- **Progress Tracking**: Monitor learning streaks and activity
- **Admin Dashboard**: Manage users, categories, and monitor platform usage
- **Rate Limiting**: Student daily question limits to encourage quality questions
- **JWT Authentication**: Secure role-based access control

## Tech Stack

### Backend
- .NET 10 Web API
- Entity Framework Core with SQL Server
- ASP.NET Core Identity
- JWT Authentication
- OpenAI Integration (with mock fallback)

### Frontend
- Angular 18 (Standalone Components)
- Bootstrap 5
- Font Awesome Icons
- Reactive Forms
- Route Guards & Interceptors

## Getting Started

### Prerequisites
- .NET 10 SDK
- Node.js 18+
- SQL Server (LocalDB)
- Angular CLI 18+

### Backend Setup
```bash
cd EduAssist.API
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend Setup
```bash
cd EduAssist.Client
npm install
ng serve
```

### Default Admin Credentials
- Email: admin@eduassist.com
- Password: Admin@123

## Project Structure

```
EduAssist.API/          - .NET 10 Web API
  Controllers/          - API endpoints
  Models/               - Entity models
  DTOs/                 - Data transfer objects
  Data/                 - DbContext & seeder
  Services/             - Business logic & AI service

EduAssist.Client/       - Angular 18 Frontend
  src/app/components/   - UI components
  src/app/services/     - API services
  src/app/models/       - TypeScript interfaces
  src/app/guards/       - Route guards
  src/app/interceptors/ - HTTP interceptors
```

## License

This project is for educational purposes.
