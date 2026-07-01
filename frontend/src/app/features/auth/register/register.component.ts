import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service'; // Inyectado
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Añadido RouterModule para el routerLink del HTML
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notify = inject(NotificationService);

  public loading: boolean = false;
  public maxDate: string = '';

  ngOnInit(): void {
    const today = new Date();
    // Restamos 18 años al año actual
    const limitYear = today.getFullYear() - 18;
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    this.maxDate = `${limitYear}-${month}-${day}`;
  }

  public registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    birthDate: ['', [Validators.required]],
    phone: [''],
    address: ['']
  });

  // Enviar el formulario
  onSubmit(): void {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      this.notify.toast('Revisa los campos obligatorios', 'warning');
      return;
    }

    this.loading = true;
    const formValues = this.registerForm.getRawValue();

    const newUser = {
      fullName: formValues.fullName!,
      email: formValues.email!,
      password: formValues.password!,
      birthDate: formValues.birthDate!,
      phone: formValues.phone || undefined,
      address: formValues.address || undefined,
    };

    this.authService.registerAction(newUser).subscribe({
      next: (res) => {
        // 1. Logueo automático: pasa el token y el objeto user que devuelve el backend
        this.authService.login(res.token, res.user);

        this.notify.toast('¡Bienvenido! Tu cuenta ha sido creada con éxito', 'success');

        // 2. Redirigir al Dashboard de usuario
        this.router.navigate(['/userDashboard']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        const errorMessage = err.error?.error || 'Error al crear la cuenta';
        this.notify.toast(errorMessage, 'error');
        console.error('Error de registro:', err);
      }
    });
  }
}