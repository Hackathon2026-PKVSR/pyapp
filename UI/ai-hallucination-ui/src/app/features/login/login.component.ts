import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  message = '';

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  signIn(): void {
    const isValid = this.auth.login(this.username.trim(), this.password);
    if (isValid) {
      this.message = '';
      this.router.navigateByUrl('/home');
      return;
    }

    this.message = 'Invalid credentials. Use the configured static login details.';
  }
}
