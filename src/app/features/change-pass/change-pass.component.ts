import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth/auth.service';

@Component({
  selector: 'app-change-pass',
  imports: [ReactiveFormsModule],
  templateUrl: './change-pass.component.html',
  styleUrl: './change-pass.component.css',
})
export class ChangePassComponent {
  private readonly authService = inject(AuthService);

  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  changePasswordForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, { validators: this.passwordsMatch });

  private passwordsMatch(form: AbstractControl): ValidationErrors | null {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return confirmPassword && newPassword !== confirmPassword ? { passwordsMismatch: true } : null;
  }

  submitChangePassword(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    const { password, newPassword } = this.changePasswordForm.getRawValue();
    this.isLoading.set(true);
    this.authService.changePassword({ password, newPassword }).subscribe({
      next: (res) => {
        const newToken = res.data?.token ?? res.token;
        if (newToken) localStorage.setItem('token', newToken);
        this.successMessage.set(res.message || 'Password updated successfully.');
        this.changePasswordForm.reset();
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Could not update your password. Please try again.');
        this.isLoading.set(false);
      },
    });
  }
}
