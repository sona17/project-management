# Architecture Documentation

## Overview

This document provides an in-depth look at the architectural decisions and patterns used in the Smart Admin Dashboard application.

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Architecture Patterns](#architecture-patterns)
3. [Folder Structure](#folder-structure)
4. [State Management](#state-management)
5. [API Layer](#api-layer)
6. [Authentication](#authentication)
7. [Error Handling](#error-handling)
8. [Performance Considerations](#performance-considerations)
9. [Security](#security)

## Technology Stack

### Core
- **Angular 18**: Latest stable version with standalone components
- **TypeScript 5.5**: Strict mode enabled
- **RxJS 7.8**: Reactive programming
- **NgRx 18**: State management

### UI & Styling
- **Angular Material 18**: UI component library
- **SCSS**: CSS preprocessor with variables and mixins

### Build & Development
- **Angular CLI**: Build tool with esbuild
- **ESLint**: Code linting (configurable)

## Architecture Patterns

### 1. Feature-First Architecture

The application follows a feature-first approach where code is organized by features rather than technical layers.

**Benefits:**
- Features are self-contained and easier to understand
- Easier to scale as the application grows
- Clear boundaries between features
- Supports lazy loading out of the box

**Structure:**
```
features/
├── auth/           # Authentication feature
├── dashboard/      # Dashboard feature
└── tasks/          # Tasks feature
    ├── components/ # Feature-specific components
    ├── models/     # Feature-specific models
    ├── services/   # Feature-specific services
    └── store/      # Feature-specific state
```

### 2. Standalone Components

All components use the standalone pattern introduced in Angular 14+.

**Benefits:**
- No NgModules needed
- Better tree-shaking
- Clearer dependencies
- Simpler mental model

**Example:**
```typescript
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, ...],
  // ...
})
export class TaskListComponent { }
```

### 3. Smart/Dumb Components

Components follow the container/presentational pattern:

**Smart Components (Containers):**
- Connect to NgRx store
- Handle business logic
- Dispatch actions
- Subscribe to selectors
- Examples: `TaskListComponent`, `DashboardContainerComponent`

**Dumb Components (Presentational):**
- Receive data via `@Input()`
- Emit events via `@Output()`
- Stateless (or minimal local state)
- Highly reusable
- Examples: `StatsCardComponent`, `LoadingSpinnerComponent`

### 4. Dependency Injection

Services use Angular's hierarchical DI system:

**Root Level (`providedIn: 'root'`):**
- Singletons shared across the app
- Examples: `AuthService`, `ApiService`

**Component Level:**
- Scoped to component lifecycle
- Used sparingly for component-specific services

## Folder Structure

### Core Module
Contains singleton services and app-wide utilities:

```
core/
├── auth/
│   ├── guards/        # Route protection
│   ├── interceptors/  # HTTP request/response handling
│   └── services/      # Authentication logic
├── api/              # Generic API service
├── models/           # Core domain models
└── utils/            # Utility functions
```

**Key Principle:** Core module code should be used across features but not dependent on any feature.

### Shared Module
Contains reusable UI components and utilities:

```
shared/
├── components/  # Reusable UI components
├── pipes/       # Custom pipes
└── directives/  # Custom directives
```

**Key Principle:** Shared code should be generic and reusable across features.

### Features
Each feature is self-contained:

```
features/[feature-name]/
├── components/  # Feature components
├── models/      # Feature-specific models
├── services/    # Feature-specific services
├── store/       # NgRx state (if needed)
└── [feature].routes.ts
```

## State Management

### NgRx Architecture

The application uses NgRx for predictable state management:

```
┌─────────────┐
│  Component  │
└──────┬──────┘
       │ dispatch(action)
       ↓
┌─────────────┐
│   Action    │
└──────┬──────┘
       │
       ├─────→ ┌──────────┐
       │       │ Reducer  │ → updates state
       │       └──────────┘
       │
       └─────→ ┌──────────┐
               │  Effect  │ → side effects (API calls)
               └────┬─────┘
                    │
                    └─────→ dispatch(new action)
```

### Store Structure

**State Shape:**
```typescript
interface AppState {
  tasks: TaskState;
  // Future: auth, users, etc.
}

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  filters: TaskFilters;
  pagination: PaginationParams;
  total: number;
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
}
```

### Actions
Using `createActionGroup` for type-safe action creators:

```typescript
export const TaskActions = createActionGroup({
  source: 'Task',
  events: {
    'Load Tasks': emptyProps(),
    'Load Tasks Success': props<{ response: PaginatedResponse<Task> }>(),
    'Load Tasks Failure': props<{ error: string }>(),
    // ...
  }
});
```

### Reducers
Using `createReducer` for immutable state updates:

```typescript
export const taskReducer = createReducer(
  initialState,
  on(TaskActions.loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  // ...
);
```

### Effects
Handling side effects with `createEffect`:

```typescript
loadTasks$ = createEffect(() =>
  this.actions$.pipe(
    ofType(TaskActions.loadTasks),
    withLatestFrom(/* selectors */),
    switchMap(/* API call */),
    map(TaskActions.loadTasksSuccess),
    catchError(/* error handling */)
  )
);
```

**Key Patterns:**
- `switchMap`: Cancel previous requests (for search/filter)
- `exhaustMap`: Ignore subsequent requests until complete (for save operations)
- `debounceTime`: Delay actions (for search input)
- `retry`: Automatic retry for failed requests

### Selectors
Memoized state selection with `createSelector`:

```typescript
export const selectAllTasks = createSelector(
  selectTaskState,
  (state: TaskState) => state.tasks
);

export const selectFilteredTasks = createSelector(
  selectAllTasks,
  selectTaskFilters,
  (tasks, filters) => {
    // Filtering logic
  }
);
```

**Benefits:**
- Memoization prevents unnecessary recalculations
- Composable selectors
- Type-safe
- Testable

## API Layer

### Three-Tier API Architecture

```
Component
    ↓
Store Effect
    ↓
Feature API Service (TaskApiService)
    ↓
Generic API Service (ApiService)
    ↓
HTTP Client
```

### Generic API Service
Provides base HTTP methods with error handling:

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  get<T>(endpoint: string): Observable<T> { }
  post<T>(endpoint: string, body: any): Observable<T> { }
  put<T>(endpoint: string, body: any): Observable<T> { }
  delete<T>(endpoint: string): Observable<T> { }
}
```

### Feature-Specific API Services
Implement business logic and data transformation:

```typescript
@Injectable({ providedIn: 'root' })
export class TaskApiService {
  getTasks(filters, pagination): Observable<PaginatedResponse<Task>> {
    // Mock API implementation
  }
}
```

### Mock API
The current implementation uses a mock API that:
- Simulates network delays (configurable)
- Stores data in localStorage for persistence
- Simulates random errors for testing error handling
- Generates realistic mock data

**Configuration** (`environment.ts`):
```typescript
{
  apiUrl: 'http://localhost:3000/api',
  apiDelay: 500,        // Delay in ms
  mockErrorRate: 0.1    // 10% error rate
}
```

## Authentication

### Authentication Flow

```
┌──────────────┐
│ Login Form   │
└──────┬───────┘
       │ submit
       ↓
┌──────────────┐
│ AuthService  │ ← validate credentials (mock)
└──────┬───────┘
       │
       ├─ Save JWT token to localStorage
       ├─ Save user data to localStorage
       └─ Update currentUser$ BehaviorSubject

Subsequent requests:
┌──────────────┐
│ HTTP Request │
└──────┬───────┘
       │
       ↓
┌──────────────────┐
│ Auth Interceptor │ ← attach Bearer token
└──────┬───────────┘
       │
       ↓
    Server
```

### Components

**AuthService:**
- Manages authentication state
- Provides `currentUser$` observable
- Provides `isAuthenticated$` observable
- Handles login/logout

**Auth Guard:**
- Protects routes requiring authentication
- Redirects to login if not authenticated
- Stores intended URL for post-login redirect

**Auth Interceptor:**
- Attaches JWT token to outgoing requests
- Skips token for login endpoint

### Token Storage
Tokens are stored in localStorage via `TokenUtil`:

```typescript
class TokenUtil {
  static saveToken(token: string): void
  static getToken(): string | null
  static removeToken(): void
  static saveUser(user: any): void
  static getUser<T>(): T | null
  static clearAll(): void
}
```

**Security Note:** In production, consider:
- Using httpOnly cookies instead of localStorage
- Implementing token refresh mechanism
- Adding token expiration checks
- Using secure flag for cookies

## Error Handling

### Global Error Interceptor

The error interceptor provides centralized error handling:

```typescript
errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    retry({
      count: 2,
      delay: (error) => {
        // Only retry server errors (5xx)
        if (error.status >= 500) return of(error);
        throw error;
      }
    }),
    catchError((error: HttpErrorResponse) => {
      // Handle different error types
      // 401: Logout and redirect
      // 403: Permission error
      // 404: Not found
      // 500+: Server error
    })
  );
};
```

**Error Handling Strategy:**
1. **Retry Logic:** Automatic retry for server errors (2 attempts)
2. **401 Handling:** Automatic logout and redirect to login
3. **User Feedback:** User-friendly error messages
4. **Error Propagation:** Errors flow to NgRx for state updates

### Component-Level Error Handling

Components display errors from the store:

```typescript
error$ = this.store.select(selectTasksError);

<app-error-message
  [message]="error$ | async"
  [showRetry]="true"
  (retry)="retryLoad()">
</app-error-message>
```

## Performance Considerations

### 1. Change Detection
- Using `OnPush` strategy where appropriate
- Async pipe for automatic subscription management
- Avoiding unnecessary re-renders

### 2. Lazy Loading
- Feature modules loaded on demand
- Using `loadChildren` in routes

### 3. NgRx Optimizations
- Memoized selectors prevent recalculation
- Using `switchMap` to cancel outdated requests
- Debouncing user input (300ms)

### 4. Bundle Size
- Standalone components for better tree-shaking
- Material components imported individually
- Production build optimizations

## Security

### Current Implementation
1. **XSS Protection:** Angular's built-in sanitization
2. **CSRF:** Not implemented (mock API)
3. **Authentication:** JWT-based (mock implementation)

### Production Recommendations
1. Implement httpOnly cookies for tokens
2. Add CSRF protection
3. Implement Content Security Policy (CSP)
4. Validate and sanitize all user inputs
5. Use HTTPS only
6. Implement rate limiting
7. Add request signing
8. Implement proper CORS policies

## Scalability Considerations

### Adding New Features
1. Create feature folder under `features/`
2. Define feature-specific models and DTOs
3. Create feature components
4. Add feature state to NgRx if needed
5. Create lazy-loaded route

### Adding New API Endpoints
1. Add endpoint to `API_ENDPOINTS` in `api.config.ts`
2. Create/update feature API service
3. Add corresponding NgRx actions/effects if using state management

### Code Organization Guidelines
- Keep components focused and single-purpose
- Extract reusable logic into services
- Use interfaces for all data structures
- Follow consistent naming conventions
- Document complex business logic
- Write self-documenting code

## Testing Strategy

### Unit Tests
- Services: Test business logic
- Guards: Test access control
- Interceptors: Test request/response transformation
- Pipes: Test data transformation

### Component Tests
- Test component logic
- Test user interactions
- Mock dependencies
- Use TestBed for integration

### NgRx Tests
- Test actions: Verify payloads
- Test reducers: Verify state changes
- Test selectors: Verify memoization
- Test effects: Mock dependencies

### E2E Tests
- Test critical user flows
- Test authentication
- Test CRUD operations
- Test error scenarios

---

This architecture provides a solid foundation for building scalable, maintainable Angular applications with proper separation of concerns, type safety, and modern best practices.
