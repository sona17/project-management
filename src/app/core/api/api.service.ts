import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { API_CONFIG } from './api.config';
import { ApiResponse } from '../models/api-response.model';

export interface RequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = API_CONFIG.baseUrl;
  private readonly timeout = API_CONFIG.timeout;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}${endpoint}`, options)
      .pipe(
        timeout(this.timeout),
        catchError(this.handleError)
      );
  }

  post<T>(endpoint: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}${endpoint}`, body, options)
      .pipe(
        timeout(this.timeout),
        catchError(this.handleError)
      );
  }

  put<T>(endpoint: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .put<T>(`${this.baseUrl}${endpoint}`, body, options)
      .pipe(
        timeout(this.timeout),
        catchError(this.handleError)
      );
  }

  patch<T>(endpoint: string, body: unknown, options?: RequestOptions): Observable<T> {
    return this.http
      .patch<T>(`${this.baseUrl}${endpoint}`, body, options)
      .pipe(
        timeout(this.timeout),
        catchError(this.handleError)
      );
  }

  delete<T>(endpoint: string, options?: RequestOptions): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}${endpoint}`, options)
      .pipe(
        timeout(this.timeout),
        catchError(this.handleError)
      );
  }

  private handleError(error: unknown): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => error);
  }
}
