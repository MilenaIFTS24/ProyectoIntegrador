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

  // Extraemos solo los valores planos para asegurar compatibilidad total con el Backend
  const { email, password } = this.loginForm.getRawValue();

  this.authService.loginAction({ email, password }).subscribe({
    next: (res) => {
      // 1. Guardamos sesión (Signals y LocalStorage)
      this.authService.login(res.token, res.user);

      this.notify.toast(`¡Bienvenido, ${res.user.fullName}!`, 'success');

      // 2. Redirección basada en el ROL que viene de la respuesta fresca
      // Usamos navigateByUrl para una navegación absoluta y limpia
      if (res.user.role === 'admin') {
        this.router.navigateByUrl('/adminDashboard/adminDashboardHome');
      } else {
        this.router.navigateByUrl('/userDashboard/userDashboardHome');
      }
    },
    error: (err: HttpErrorResponse) => {
      this.loading = false;
      // Si el backend da 401, el error suele venir en err.error.message o err.error.error
      const msg = err.error?.error || err.error?.message || 'Credenciales incorrectas';
      this.notify.toast(msg, 'error');
      console.error('Error 401 Detalles:', err);
    }
  });
}
}