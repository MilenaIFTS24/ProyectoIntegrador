import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html'
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
    
    const credentials = this.loginForm.value;

    // Llamamos al servicio (que usa el ApiService hacia /api/auth/login)
    this.authService.loginAction(credentials).subscribe({
      next: (res) => {
        // 1. Guardamos token y rol en los SIGNALS a través del AuthService
        // res.user.role viene del backend (Sequelize)
        this.authService.login(res.token, res.user);

        this.notify.toast(`¡Bienvenido de nuevo, ${res.user.fullName}!`, 'success');

        // 2. Redirección inteligente basada en el ROL
        const route = res.user.role === 'admin' ? '/adminDashboard' : '/userDashboard';
        this.router.navigate([route]);
      },
      error: (err) => {
        // El interceptor ya captura errores globales, pero aquí
        // manejamos el mensaje específico de "Credenciales inválidas"
        this.loading = false;
        const msg = err.error?.error || 'Error al iniciar sesión';
        this.notify.toast(msg, 'error');
      }
    });
  }
}