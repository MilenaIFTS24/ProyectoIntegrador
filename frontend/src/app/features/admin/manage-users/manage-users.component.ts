import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

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

  public users: User[] = [];
  public loading: boolean = false;

  // Paginación
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
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
  }

  // --- PERSISTENCIA: OBTENER TODOS ---
  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.loading = false;
      }
    });
  }

  // --- LÓGICA DE PAGINACIÓN ---
  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.users.slice(start, start + this.itemsPerPage);
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

  // --- CRUD: PREPARAR EDICIÓN ---
  editUser(user: User): void {
    // 1. Habilitamos todo para limpiar el estado previo
    this.userForm.enable();
    this.userForm.reset();

    // 2. Cargamos los datos (ponemos un hash falso en password para cumplir el formulario)
    this.userForm.patchValue({
      ...user,
      password: 'PROTECTED_PASSWORD' 
    });

    // 3. Bloqueamos el campo contraseña para edición (Regla de negocio)
    const passwordControl = this.userForm.get('password');
    passwordControl?.disable();
    passwordControl?.setValidators(null);
    passwordControl?.updateValueAndValidity();

    this.scrollToElement('.user-card');
  }

  // --- CRUD: PROCESAR FORMULARIO ---
  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    // Usamos getRawValue para incluir el 'id' que puede estar deshabilitado
    const formData = this.userForm.getRawValue() as User;
    const isEdit = !!formData.id;

    if (isEdit) {
      this.updateUserLogic(formData);
    } else {
      this.createUserLogic(formData);
    }
  }

  private createUserLogic(userData: User): void {
    this.loading = true;
    // Omitimos el ID para que Sequelize lo autogenere
    const { id, ...newUser } = userData;

    this.userService.addUser(newUser).subscribe({
      next: (res) => {
        // Actualización inmutable para refrescar la tabla al instante
        this.users = [...this.users, res];
        this.onCancel();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        this.loading = false;
      }
    });
  }

  private updateUserLogic(userData: User): void {
    this.loading = true;
    // Quitamos password para NO sobreescribir la real con el valor ficticio del formulario
    const { password, ...dataToSave } = userData;

    this.userService.updateUser(userData.id!, dataToSave).subscribe({
      next: (res) => {
        // Reemplazamos solo el usuario editado en la lista local
        this.users = this.users.map(u => u.id === res.id ? res : u);
        this.onCancel();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
        this.loading = false;
      }
    });
  }

  // --- CRUD: ELIMINAR ---
  deleteUser(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
        },
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }

  // --- LIMPIEZA Y UI ---
  onCancel(): void {
    this.userForm.enable();
    this.userForm.reset({
      role: 'user',
      isEnabled: true,
      isEmailVerified: false
    });

    // Restauramos validadores obligatorios para futuros registros nuevos
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
  }

  private scrollToElement(selector: string): void {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      const targetPosition = element.offsetTop - this.NAVBAR_OFFSET;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  }
}