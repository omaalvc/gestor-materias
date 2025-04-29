import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EstudianteService } from '../../../services/estudiante.service';
import { MateriaService } from '../../../services/materia.service';

interface Estudiante {
  id?: number;
  nombre: string;
  email: string;
}

interface Materia {
  id?: number;
  nombre: string;
  descripcion: string;
  creditos: number;
}

@Component({
  selector: 'app-detalle-estudiante',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-estudiante.component.html',
  styleUrls: ['./detalle-estudiante.component.css']
})
export class DetalleEstudianteComponent implements OnInit {
  estudianteId: number = 0;
  estudiante: Estudiante | null = null;
  materias: Materia[] = [];
  materiasDisponibles: Materia[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private estudianteService: EstudianteService,
    private materiaService: MateriaService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.estudianteId = +params['id'];
      this.cargarEstudiante();
      this.cargarMaterias();
    });
  }

  cargarEstudiante(): void {
    this.loading = true;
    this.estudianteService.getEstudiante(this.estudianteId)
      .subscribe({
        next: (data) => {
          this.estudiante = data.estudiante;
          this.materias = data.materias;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al cargar el estudiante. ' + (error.error?.message || error.message);
          this.loading = false;
        }
      });
  }

  cargarMaterias(): void {
    this.materiaService.getMaterias()
      .subscribe({
        next: (data) => {
          this.materiasDisponibles = data.filter(materia => 
            !this.materias.some(m => m.id === materia.id)
          );
        },
        error: (error) => {
          this.errorMessage = 'Error al cargar materias disponibles. ' + (error.error?.message || error.message);
        }
      });
  }

  matricular(materiaId: number): void {
    this.loading = true;
    this.estudianteService.matricularEstudiante(this.estudianteId, materiaId)
      .subscribe({
        next: () => {
          // Actualizar la lista de materias matriculadas
          const materiaMatriculada = this.materiasDisponibles.find(m => m.id === materiaId);
          if (materiaMatriculada) {
            this.materias.push(materiaMatriculada);
            this.materiasDisponibles = this.materiasDisponibles.filter(m => m.id !== materiaId);
          }
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al matricular en la materia. ' + (error.error?.message || error.message);
          this.loading = false;
        }
      });
  }

  cancelarMatricula(materiaId: number): void {
    if (confirm('¿Está seguro de cancelar la inscripción a esta materia?')) {
      this.loading = true;
      this.estudianteService.cancelarMatricula(this.estudianteId, materiaId)
        .subscribe({
          next: () => {
            // Actualizar la lista de materias
            const materiaCancelada = this.materias.find(m => m.id === materiaId);
            if (materiaCancelada) {
              this.materiasDisponibles.push(materiaCancelada);
              this.materias = this.materias.filter(m => m.id !== materiaId);
            }
            this.loading = false;
          },
          error: (error) => {
            this.errorMessage = 'Error al cancelar la matrícula. ' + (error.error?.message || error.message);
            this.loading = false;
          }
        });
    }
  }

  volver(): void {
    this.router.navigate(['/estudiantes']);
  }
}