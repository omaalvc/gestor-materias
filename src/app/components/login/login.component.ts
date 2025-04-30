import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    // Redirigir si ya está autenticado
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/admin/materias']);
    }

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  // Getter para acceder fácilmente a los campos del formulario
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    
    // Detener si el formulario es inválido
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.f['username'].value, this.f['password'].value)
      .subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);
          
          if (response.success) {
            // Redirigir basado en el rol del usuario
            if (this.authService.isAdmin()) {
              this.router.navigate(['/admin/materias']);
            } else {
              this.router.navigate(['/materias']);
            }
          } else {
            this.error = 'Credenciales inválidas';
            this.loading = false;
          }
        },
        error: (error) => {
          console.error('Error en login:', error);
          this.error = error?.error?.message || 'Error al iniciar sesión. Intente nuevamente.';
          this.loading = false;
        }
      });
  }
}