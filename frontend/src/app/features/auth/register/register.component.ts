import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  //inject notificationservice

  public loading: boolean = false;

  public registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    birthDate: ['', [Validators.required]], // Formato HTML date: 'YYYY-MM-DD'
    phone: [''],
    address: ['']
  });


  onSubmit(): void {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      //this.notify.toast('Revisa los campos obligatorios', 'warning');
      return;
    }

    this.loading = true;
    const formValues = this.registerForm.getRawValue();

    const newUser: User = {
      fullName: formValues.fullName!,
      email: formValues.email!,
      password: formValues.password!,
      birthDate: formValues.birthDate!,
      phone: formValues.phone || undefined,
      address: formValues.address || undefined,
    };

    // //this.authService.register(newUser).subscribe({
    //   next: () => {
    //     //this.notify.toast('¡Cuenta creada! Ya puedes ingresar', 'success');
    //     this.router.navigate(['/login']);
    //   },
    //   error: (err: any) => {
    //     this.loading = false;        
    //     const errorMessage = err.error?.message || 'Error en el registro';
    //     //this.notify.toast(errorMessage, 'error');
    //     console.error('Error de registro:', err);
    //   }
    // })
  }
}
