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
        // --- MAPEO PARA SUPABASE ---
        // Supabase devuelve el token como 'access_token'
        const token = res.access_token;

        // Construimos el objeto user extrayendo los datos de los metadatos de Supabase
        const user = {
          fullName: res.user.user_metadata?.['fullName'] || res.user.email,
          role: res.user.user_metadata?.['role'] || 'user', // Rol por defecto si no existe
          email: res.user.email
        };

        // Ahora sí, llamamos a la función de guardado con la estructura que tus Signals esperan
        this.authService.login(token, user);

        this.notify.toast(`¡Bienvenido, ${user.fullName}!`, 'success');

        // Redirección
        if (user.role === 'admin') {
          this.router.navigateByUrl('/adminDashboard/adminDashboardHome');
        } else {
          this.router.navigateByUrl('/userDashboard/userDashboardHome');
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        // Supabase suele enviar el error en err.error.error_description
        const msg = err.error?.error_description || 'Credenciales incorrectas';
        this.notify.toast(msg, 'error');
        console.error('Error de Supabase:', err);
      }
    });
  }
}