import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private notify = inject(NotificationService);

  public users: User[] = [];
  public loading: boolean = false;
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  public maxDate: string = '';
  private readonly NAVBAR_OFFSET = 110;

  public userForm = this.fb.group({
    id: [null as number | null],
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    birthDate: ['', [Validators.required]],
    role: ['user', [Validators.required]],
    phone: [''],
    address: [''],
    isEnabled: [true],
    isEmailVerified: [false]
  });

  ngOnInit(): void {
    this.loadUsers();
    this.calculateMaxDate();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notify.toast('Error al cargar usuarios', 'error');
      }
    });
  }

  private calculateMaxDate(): void {
    const today = new Date();
    const limitYear = today.getFullYear() - 18;
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');

    this.maxDate = `${limitYear}-${month}-${day}`;
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.users.slice(start, end);
  }
  get totalPages(): number {
    return Math.ceil(this.users.length / this.itemsPerPage) || 1;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.scrollToElement('.custom-table');
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = this.userForm.getRawValue() as User;

    if (formData.id) {
      const { password, ...dataToSave } = formData;
      this.userService.updateUser(formData.id, dataToSave).subscribe({
        next: () => {
          this.notify.toast('Usuario actualizado');
          this.loadUsers();
          this.onCancel();
        },
        error: () => (this.loading = false)
      });
    } else {
      this.userService.addUser(formData).subscribe({
        next: () => {
          this.notify.toast('Usuario creado');
          this.loadUsers();
          this.onCancel();
        },
        error: () => (this.loading = false)
      });
    }
  }

  editUser(user: User): void {
    this.userForm.enable();
    this.userForm.reset();
    this.userForm.patchValue({ ...user, password: 'PROTECTED_PASSWORD' });
    this.userForm.get('password')?.disable();

    // Ejecutamos el scroll al formulario
    this.scrollToElement('.user-card');
  }

  deleteUser(id: number | undefined): void {
    if (!id) return;
    this.notify.confirm('¿Eliminar usuario?', 'Esta acción no se puede deshacer').then(res => {
      if (res.isConfirmed) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.notify.toast('Eliminado correctamente');
            this.loadUsers();
          }
        });
      }
    });
  }

  onCancel(): void {
    this.userForm.enable();
    this.userForm.reset({ role: 'user', isEnabled: true, isEmailVerified: false });
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.loading = false;
  }

  /**
   * Método de Scroll Mejorado
   * Usa getBoundingClientRect para precisión y setTimeout para esperar al DOM.
   */
  private scrollToElement(selector: string): void {
    setTimeout(() => {
      const element = document.querySelector(selector);
      if (element) {
        // 1. Forzamos el scroll al elemento
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // 2. Esperamos a que termine el scroll (aprox 300ms) y ajustamos la posición.
        setTimeout(() => {
          window.scrollBy(0, -this.NAVBAR_OFFSET);
        }, 300);
      }
    }, 100); // Aumentamos a 100ms para asegurar que el DOM reaccionó
  }
}