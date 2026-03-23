// login.component.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
//import { NotificationService } from '../../../core/services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  //private notify = inject(NotificationService);
  private router = inject(Router);

  public loading = false;

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const credentials = this.loginForm.getRawValue();

    this.authService.loginAction(credentials).subscribe({
      next: () => {
        // El 'res.token' lo manejamos en el servicio (vimos el .pipe(tap) antes)
        //this.notify.toast('¡Bienvenido de nuevo!', 'success');
        alert('Bienvenido de nuevo!');
        this.router.navigate(['/adminDashboard']); // Redirigimos al panel
      },
      error: (err: any) => {
        this.loading = false;
        // Error 401: Credenciales incorrectas
        const msg = err.status === 401 ? 'Correo o contraseña incorrectos' : 'Error de conexión';
        //this.notify.toast(msg, 'error');
        alert(msg);
      }
    });
  }
}