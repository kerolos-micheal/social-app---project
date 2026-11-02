import { Component, inject, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  registerErrorMessage : WritableSignal<string> = signal("")
  registerSuccssMessage : WritableSignal<string> = signal("")
  isLoading = signal(false)
  
  registerForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    username: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    gender: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
    ]),
    rePassword: new FormControl('', [Validators.required]),
  },{validators: this.confirmPassword});

  submitRegister() {
    if (this.registerForm.valid) {
    this.isLoading.set(true)
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          if(res.success){
          this.registerSuccssMessage.set(res.message)
          setTimeout(()=>{this.router.navigate(["/login"])},2000)
          }
        },
        error: (err) => {
          this.registerErrorMessage.set(err.error?.message || 'Could not create your account. Please try again.')
          this.isLoading.set(false)
        },
        complete:() => {
        this.isLoading.set(false)
        } 
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
  confirmPassword (form:AbstractControl){
  let password = form.get("password")?.value
  let rePassword = form.get("rePassword")?.value
  
  if (password !== rePassword && form.get("rePassword")?.touched){
  form.get("rePassword")?.setErrors({mismatch:true})
  return {mismath:true}
  }
  else {
  return null
  }
  }
  togglePassword(passwordElement:any){
  if (passwordElement.type == "password") {
    passwordElement.type = "text"
  }else{
  passwordElement.type = "password"
  }
  }
}
