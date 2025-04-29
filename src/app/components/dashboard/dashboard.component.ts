import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MateriaService } from '../../services/materia.service';
import { EstudianteService } from '../../services/estudiante.service';
import { NavbarComponent } from '../navbar/navbar.component';

interface Materia {
  id?: number;
  nombre: string;
  descripcion: string;
  creditos: number;
}

interface Estudiante {
  id?: number;
  nombre: string;
  email: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username: string = '';
  role: string = '';
  totalEstudiantes: number = 0;
  totalMaterias: number = 0;
  materias: Materia[] = [];
  estudiantes: Estudiante[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private materiaService: MateriaService,
    private estudianteService: EstudianteService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.username = user.username;
        this.role = user.role;
      }
    });
    
    this.cargarResumen();
  }
  
  cargarResumen(): void {
    this.loading = true;
    
    // Cargar materias
    this.materiaService.getMaterias().subscribe({
      next: (data) => {
        this.materias = data.slice(0, 5); // Solo mostrar las primeras 5
        this.totalMaterias = data.length;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las materias: ' + (error.error?.message || error.message);
        this.loading = false;
      }
    });
    
    // Cargar estudiantes
    this.estudianteService.getEstudiantes().subscribe({
      next: (data) => {
        this.estudiantes = data.slice(0, 5); // Solo mostrar los primeros 5
        this.totalEstudiantes = data.length;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los estudiantes: ' + (error.error?.message || error.message);
      }
    });
  }
}