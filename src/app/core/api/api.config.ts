import { environment } from '../../../environments/environment';

export const API_CONFIG = {
  baseUrl: environment.apiUrl,
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  tasks: {
    list: '/tasks',
    create: '/tasks',
    update: (id: string) => `/tasks/${id}`,
    delete: (id: string) => `/tasks/${id}`,
    getById: (id: string) => `/tasks/${id}`,
  },
} as const;
