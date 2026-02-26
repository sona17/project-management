import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    retry({
      count: 2,
      delay: (error: HttpErrorResponse) => {
        // Only retry on server errors (5xx) or network errors
        if (error.status >= 500 || error.status === 0) {
          return throwError(() => error);
        }
        // Don't retry client errors
        throw error;
      }
    }),
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;

        // Handle 401 Unauthorized
        if (error.status === 401) {
          authService.logout();
          router.navigate(['/login']);
          errorMessage = 'Session expired. Please login again.';
        }

        // Handle 403 Forbidden
        if (error.status === 403) {
          errorMessage = 'You do not have permission to perform this action.';
        }

        // Handle 404 Not Found
        if (error.status === 404) {
          errorMessage = 'The requested resource was not found.';
        }

        // Handle 500 Server Error
        if (error.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      }

      console.error('HTTP Error:', errorMessage);

      return throwError(() => ({
        message: errorMessage,
        statusCode: error.status,
        error: error.error,
        timestamp: new Date().toISOString()
      }));
    })
  );
};
