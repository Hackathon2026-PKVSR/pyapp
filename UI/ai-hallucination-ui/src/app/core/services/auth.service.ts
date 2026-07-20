import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly isLoggedInSignal = signal(false);

  readonly isLoggedIn = this.isLoggedInSignal.asReadonly();

  login(username: string, password: string): boolean {
    const isValid = username === 'admin_user' && password === 'Admin@123';
    this.isLoggedInSignal.set(isValid);
    return isValid;
  }

  logout(): void {
    this.isLoggedInSignal.set(false);
  }
}