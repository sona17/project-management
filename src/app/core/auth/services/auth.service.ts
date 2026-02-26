import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { User, LoginCredentials, AuthResponse, UserRole } from '../../models/user.model';
import { TokenUtil } from '../../utils/token.util';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Mock users for demonstration
  private mockUsers = [
    {
      id: '1',
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      role: UserRole.ADMIN
    },
    {
      id: '2',
      email: 'user@example.com',
      password: 'user123',
      name: 'John Doe',
      role: UserRole.USER
    }
  ];

  constructor() {}

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Mock API call
    const user = this.mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return throwError(() => ({
        message: 'Invalid email or password',
        statusCode: 401
      })).pipe(delay(environment.apiDelay));
    }

    // Simulate random API errors
    if (Math.random() < environment.mockErrorRate) {
      return throwError(() => ({
        message: 'Server error occurred',
        statusCode: 500
      })).pipe(delay(environment.apiDelay));
    }

    const authResponse: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token: this.generateMockToken(user.id),
      expiresIn: Date.now() + 3600000 // 1 hour from now
    };

    return of(authResponse).pipe(
      delay(environment.apiDelay),
      tap(response => {
        TokenUtil.saveToken(response.token);
        TokenUtil.saveUser(response.user);
        this.currentUserSubject.next(response.user);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    TokenUtil.clearAll();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return TokenUtil.getToken();
  }

  getCurrentUser(): User | null {
    return TokenUtil.getUser<User>();
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  private hasValidToken(): boolean {
    const token = TokenUtil.getToken();
    return !!token;
  }

  private generateMockToken(userId: string): string {
    // Generate a mock JWT-like token
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: userId,
      iat: Date.now(),
      exp: Date.now() + 3600000
    }));
    const signature = btoa('mock-signature');
    return `${header}.${payload}.${signature}`;
  }
}
