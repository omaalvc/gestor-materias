import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EstudianteService } from '../../../services/estudiante.service';

interface Estudiante {
  id?: string;
  nombre: string;
  email: string;
}

@Component({
  selector: 'app-lista-estudiantes',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './lista-estudiantes.component.html',
  styleUrls: ['./lista-estudiantes.component.css']
})
export class ListaEstudiantesComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  loading: boolean = false;
  errorMsg: string = '';
  
  constructor(
    private estudianteService: EstudianteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {
    this.loading = true;
    this.estudianteService.getEstudiantes()
      .subscribe({
        next: (data) => {
          this.estudiantes = data;
          this.loading = false;
        },
        error: (error) => {
          this.errorMsg = 'Error al cargar estudiantes. ' + (error.error?.message || error.message);
          this.loading = false;
        }
      });
  }

  verDetalle(id: string): void {
    this.router.navigate(['/estudiantes', id]);
  }

  nuevoEstudiante(): void {
    this.router.navigate(['/estudiantes/nuevo']);
  }

  editarEstudiante(id: string): void {
    this.router.navigate(['/estudiantes/editar', id]);
  }

  eliminarEstudiante(id: string): void {
    if (confirm('¿Está seguro de eliminar este estudiante?')) {
      this.loading = true;
      this.estudianteService.eliminarEstudiante(id)
        .subscribe({
          next: () => {
            this.cargarEstudiantes();
          },
          error: (error: any) => {
            this.errorMsg = 'Error al eliminar el estudiante';
            this.loading = false;
          }
        });
    }
  }
}