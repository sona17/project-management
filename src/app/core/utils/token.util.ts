const TOKEN_KEY = 'auth_token';
const USER_KEY = 'current_user';

export class TokenUtil {
  static saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  static removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  static saveUser(user: unknown): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  static getUser<T>(): T | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static removeUser(): void {
    localStorage.removeItem(USER_KEY);
  }

  static clearAll(): void {
    this.removeToken();
    this.removeUser();
  }

  static isTokenExpired(expiresIn: number): boolean {
    const expirationTime = new Date(expiresIn * 1000);
    return new Date() > expirationTime;
  }
}
