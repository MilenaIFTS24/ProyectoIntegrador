import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotificationService);

  public loading: boolean = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });


  onSubmit() {
  if (this.loginForm.invalid) return;
  
  this.loading = true;

  const { email, password } = this.loginForm.getRawValue();

  this.authService.loginAction({ email, password }).subscribe({
    next: (res) => {
      // 1. Guarda sesión
      this.authService.login(res.token, res.user);

      this.notify.toast(`¡Bienvenido, ${res.user.fullName}!`, 'success');

      // 2. Redirección basada en el ROL que viene de la respuesta fresca
      // Uso navigateByUrl para una navegación absoluta y limpia
      if (res.user.role === 'admin') {
        this.router.navigateByUrl('/adminDashboard/adminDashboardHome');
      } else {
        this.router.navigateByUrl('/userDashboard/userDashboardHome');
      }
    },
    error: (err: HttpErrorResponse) => {
      this.loading = false;
      const msg = err.error?.error || err.error?.message || 'Credenciales incorrectas';
      this.notify.toast(msg, 'error');
      console.error('Error 401 Detalles:', err);
    }
  });
}
}