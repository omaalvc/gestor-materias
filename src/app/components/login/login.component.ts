import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Si ya está autenticado, redirigir a la página principal
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.loading = false;
        
        // Verificar el rol del usuario para la redirección
        const userRole = this.authService.getUserRole();
        if (userRole === 'Administrador' || userRole === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/student/dashboard']);
        }
      },
      error: (error) => {
        console.error('Error durante el login:', error);
        this.loading = false;
        
        // Intentar extraer mensaje de error de diferentes formas según la estructura del error
        if (error.error && typeof error.error === 'object') {
          // Si el error viene como objeto JSON en la respuesta
          this.errorMessage = error.error.message || 'Error en inicio de sesión';
        } else if (error.message) {
          // Si el error tiene un mensaje directo
          this.errorMessage = error.message;
        } else {
          // Mensaje genérico
          this.errorMessage = 'Error en inicio de sesión. Por favor, verifica tus credenciales.';
        }
      }
    });
  }
}