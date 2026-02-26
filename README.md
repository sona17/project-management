# Smart Admin Dashboard

A production-ready Angular 18 Smart Admin Dashboard demonstrating mid-level frontend architecture with modern best practices, NgRx state management, and clean code principles.

## 🚀 Features

- **Modern Angular**: Built with Angular 18 and standalone components
- **State Management**: NgRx with actions, reducers, effects, and selectors
- **Authentication**: JWT-based auth with interceptors and route guards
- **Task Management**: Full CRUD operations with pagination and filtering
- **Responsive Design**: Mobile-first responsive UI with Angular Material
- **Type Safety**: Strict TypeScript configuration, no `any` types
- **Clean Architecture**: Feature-first folder structure with separation of concerns
- **Error Handling**: Centralized error handling with retry strategies
- **Mock API**: Built-in mock API for demonstration purposes

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (optional, but recommended)

## 🛠️ Installation

1. **Clone the repository** (or use this project directly)

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   # or
   ng serve
   ```

4. **Open your browser:**
   Navigate to `http://localhost:4200`

## 🔑 Demo Credentials

The application includes mock authentication. Use these credentials:

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**User Account:**
- Email: `user@example.com`
- Password: `user123`

## 📁 Project Structure

```
src/
├── app/
│   ├── core/                      # Singleton services, guards, interceptors
│   │   ├── auth/                  # Authentication logic
│   │   │   ├── guards/            # Route guards
│   │   │   ├── interceptors/      # HTTP interceptors
│   │   │   └── services/          # Auth service
│   │   ├── api/                   # API service layer
│   │   ├── models/                # Core models
│   │   └── utils/                 # Utility functions
│   │
│   ├── shared/                    # Reusable components & utilities
│   │   ├── components/            # Shared UI components
│   │   └── pipes/                 # Custom pipes
│   │
│   ├── features/                  # Feature modules
│   │   ├── auth/                  # Login feature
│   │   ├── dashboard/             # Dashboard feature
│   │   └── tasks/                 # Tasks feature with NgRx
│   │       ├── components/        # Task components
│   │       ├── models/            # Task models & DTOs
│   │       ├── services/          # Task API service
│   │       └── store/             # NgRx store
│   │
│   ├── store/                     # Root store configuration
│   ├── app.config.ts              # App configuration
│   ├── app.routes.ts              # Route configuration
│   └── app.component.ts           # Root component
│
├── environments/                  # Environment configurations
└── styles/                        # Global styles
```

## 🏗️ Architecture Decisions

### 1. Standalone Components
- **Why?** Modern Angular pattern (v14+) that eliminates NgModules
- **Benefits:** Better tree-shaking, simpler dependency management, reduced boilerplate

### 2. Feature-First Structure
- **Why?** Scalable for large applications
- **Benefits:** Clear separation of concerns, easy navigation, self-contained features

### 3. NgRx for State Management
- **Why?** Predictable state management for complex applications
- **Benefits:**
  - Centralized state
  - Time-travel debugging with Redux DevTools
  - Testable actions and reducers
  - Side effects isolated in effects
  - Reactive data flow

### 4. Interceptor Chain
The HTTP interceptors are executed in this order:
1. **Auth Interceptor:** Attaches JWT token to requests
2. **Error Interceptor:** Handles errors, implements retry logic, manages 401 redirects

### 5. Smart/Dumb Components Pattern
- **Smart (Container) Components:** Connect to NgRx store, handle business logic
- **Dumb (Presentation) Components:** Receive data via inputs, emit events via outputs
- **Benefits:** Better testability and reusability

### 6. Strict TypeScript
- No `any` types allowed
- Strict null checks
- Proper interfaces and DTOs for all data structures

## 🔄 Data Flow

```
Component → Dispatch Action → Effect → API Service → Backend (Mock)
                ↓
            Reducer updates State
                ↓
            Selector emits new state
                ↓
            Component receives update
```

## 🎨 Styling

- **Framework:** Angular Material
- **Custom Theme:** Custom color palette and variables
- **Responsive:** Mobile-first responsive design
- **SCSS:** Modular SCSS with variables and mixins

## 🧪 Testing (Structure)

The project is structured to support:
- Unit tests for services, guards, and interceptors
- Component tests with TestBed
- NgRx store testing (actions, reducers, selectors)
- Integration tests for critical user flows

*Note: Test implementations are not included but the architecture supports them.*

## 📦 Build

**Development build:**
```bash
npm run build
```

**Production build:**
```bash
npm run build -- --configuration production
```

The build artifacts will be stored in the `dist/` directory.

## 🔍 NgRx DevTools

This application includes NgRx Store DevTools integration. Install the [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools) for your browser to:

- Inspect dispatched actions
- View state changes
- Time-travel debug
- Export/import state

## 📚 Key Concepts Demonstrated

### NgRx Implementation
- **Actions:** Type-safe action creators using `createActionGroup`
- **Reducers:** Immutable state updates with `createReducer`
- **Effects:** Side effects handling with `createEffect`
- **Selectors:** Memoized state selection with `createSelector`

### HTTP Layer
- **API Service:** Centralized HTTP service with type-safe responses
- **Interceptors:** Request/response transformation and error handling
- **Retry Strategy:** Automatic retry for server errors
- **Error Handling:** User-friendly error messages

### Authentication Flow
1. User submits login form
2. Auth service validates credentials (mock)
3. JWT token stored in localStorage
4. Auth interceptor attaches token to subsequent requests
5. Auth guard protects routes
6. 401 errors trigger logout and redirect

### Task Management
- **Pagination:** Server-side pagination support
- **Filtering:** Filter by status, priority, and search term
- **CRUD Operations:** Create, read, update, delete tasks
- **Optimistic Updates:** Immediate UI feedback
- **Error Handling:** Graceful error handling with retry options

## 🚧 Future Enhancements

- [ ] Add dark/light theme toggle
- [ ] Implement actual backend API
- [ ] Add comprehensive unit and E2E tests
- [ ] Add user profile management
- [ ] Implement role-based access control
- [ ] Add analytics dashboard
- [ ] Implement drag-and-drop task reordering
- [ ] Add task comments and attachments
- [ ] Implement WebSocket for real-time updates
- [ ] Add export functionality (CSV, PDF)

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify for your own use.

## 📄 License

MIT License - feel free to use this project for learning or as a starting point for your own applications.

## 🙏 Acknowledgments

- Angular team for the amazing framework
- NgRx team for state management
- Angular Material team for UI components

---

**Built with ❤️ using Angular 18, NgRx, and TypeScript**
