import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  loginErrorMessage: WritableSignal<string> = signal('');
  loginSuccssMessage: WritableSignal<string> = signal('');
  isLoading = signal(false);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.loginErrorMessage.set('');
    this.loginSuccssMessage.set('');

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.loginSuccssMessage.set(res.message);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('id', res.data.user._id);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setTimeout(() => {
          this.router.navigate(['/feed']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.loginErrorMessage.set(err.error?.message || 'Something went wrong');
      },
    });
  }
  togglePassword(passwordElement:any){
  if (passwordElement.type == "password") {
    passwordElement.type = "text"
  }else{
  passwordElement.type = "password"
  }
  }
}
