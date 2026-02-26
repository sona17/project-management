import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  TaskFilters,
  TaskStatus,
  TaskPriority
} from '../models/task.model';
import { PaginationParams, PaginatedResponse } from '../../../core/models/api-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskApiService {
  private readonly STORAGE_KEY = 'tasks_data';
  private tasks: Task[] = [];

  constructor() {
    this.loadTasksFromStorage();
    if (this.tasks.length === 0) {
      this.tasks = this.generateMockTasks();
      this.saveTasksToStorage();
    }
  }

  getTasks(
    filters: TaskFilters,
    pagination: PaginationParams
  ): Observable<PaginatedResponse<Task>> {
    // Simulate random errors
    if (Math.random() < environment.mockErrorRate) {
      return throwError(() => ({
        message: 'Failed to load tasks',
        statusCode: 500
      })).pipe(delay(environment.apiDelay));
    }

    let filteredTasks = [...this.tasks];

    // Apply filters
    if (filters.status) {
      filteredTasks = filteredTasks.filter(t => t.status === filters.status);
    }

    if (filters.priority) {
      filteredTasks = filteredTasks.filter(t => t.priority === filters.priority);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredTasks = filteredTasks.filter(
        t =>
          t.title.toLowerCase().includes(search) ||
          t.description.toLowerCase().includes(search)
      );
    }

    // Apply pagination
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    const paginatedTasks = filteredTasks.slice(start, end);

    const response: PaginatedResponse<Task> = {
      data: paginatedTasks,
      total: filteredTasks.length,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(filteredTasks.length / pagination.pageSize)
    };

    return of(response).pipe(delay(environment.apiDelay));
  }

  getTaskById(id: string): Observable<Task> {
    const task = this.tasks.find(t => t.id === id);

    if (!task) {
      return throwError(() => ({
        message: 'Task not found',
        statusCode: 404
      })).pipe(delay(environment.apiDelay));
    }

    return of(task).pipe(delay(environment.apiDelay));
  }

  createTask(dto: CreateTaskDto): Observable<Task> {
    // Simulate random errors
    if (Math.random() < environment.mockErrorRate) {
      return throwError(() => ({
        message: 'Failed to create task',
        statusCode: 500
      })).pipe(delay(environment.apiDelay));
    }

    const task: Task = {
      id: this.generateId(),
      title: dto.title,
      description: dto.description,
      status: dto.status,
      priority: dto.priority,
      dueDate: new Date(dto.dueDate),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.tasks = [task, ...this.tasks];
    this.saveTasksToStorage();

    return of(task).pipe(delay(environment.apiDelay));
  }

  updateTask(id: string, dto: UpdateTaskDto): Observable<Task> {
    // Simulate random errors
    if (Math.random() < environment.mockErrorRate) {
      return throwError(() => ({
        message: 'Failed to update task',
        statusCode: 500
      })).pipe(delay(environment.apiDelay));
    }

    const taskIndex = this.tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return throwError(() => ({
        message: 'Task not found',
        statusCode: 404
      })).pipe(delay(environment.apiDelay));
    }

    const updatedTask: Task = {
      ...this.tasks[taskIndex],
      ...dto,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : this.tasks[taskIndex].dueDate,
      updatedAt: new Date()
    };

    this.tasks[taskIndex] = updatedTask;
    this.saveTasksToStorage();

    return of(updatedTask).pipe(delay(environment.apiDelay));
  }

  deleteTask(id: string): Observable<void> {
    // Simulate random errors
    if (Math.random() < environment.mockErrorRate) {
      return throwError(() => ({
        message: 'Failed to delete task',
        statusCode: 500
      })).pipe(delay(environment.apiDelay));
    }

    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasksToStorage();

    return of(void 0).pipe(delay(environment.apiDelay));
  }

  private generateMockTasks(): Task[] {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Implement user authentication',
        description: 'Set up JWT-based authentication system with refresh tokens',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        title: 'Design dashboard UI',
        description: 'Create wireframes and mockups for the admin dashboard',
        status: TaskStatus.DONE,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        status: TaskStatus.TODO,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        title: 'Write API documentation',
        description: 'Document all REST API endpoints with Swagger/OpenAPI',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '5',
        title: 'Optimize database queries',
        description: 'Analyze and optimize slow queries, add proper indexes',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '6',
        title: 'Implement real-time notifications',
        description: 'Add WebSocket support for real-time push notifications',
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '7',
        title: 'Add unit tests',
        description: 'Write unit tests for core business logic, aim for 80% coverage',
        status: TaskStatus.DONE,
        priority: TaskPriority.HIGH,
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: '8',
        title: 'Refactor legacy code',
        description: 'Clean up old codebase, remove deprecated functions',
        status: TaskStatus.TODO,
        priority: TaskPriority.LOW,
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];

    return mockTasks;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private saveTasksToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
    } catch (error) {
      console.error('Failed to save tasks to storage:', error);
    }
  }

  private loadTasksFromStorage(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        this.tasks = JSON.parse(data).map((task: Task) => ({
          ...task,
          dueDate: new Date(task.dueDate),
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        }));
      }
    } catch (error) {
      console.error('Failed to load tasks from storage:', error);
      this.tasks = [];
    }
  }
}
