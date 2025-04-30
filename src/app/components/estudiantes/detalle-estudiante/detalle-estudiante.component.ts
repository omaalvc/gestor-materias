import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EstudianteService } from '../../../services/estudiante.service';
import { MateriaService } from '../../../services/materia.service';
import { Estudiante } from '../../../models/estudiante.interface';

@Component({
  selector: 'app-detalle-estudiante',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-estudiante.component.html',
  styleUrls: ['./detalle-estudiante.component.css']
})
export class DetalleEstudianteComponent implements OnInit {
  estudianteId: string = '';
  estudiante: Estudiante | null = null;
  materiasDisponibles: any[] = [];
  loading = false;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private estudianteService: EstudianteService,
    private materiaService: MateriaService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.estudianteId = id;
        this.cargarEstudiante();
      }
    });
  }

  cargarEstudiante(): void {
    this.loading = true;
    this.estudianteService.getEstudiante(this.estudianteId)
      .subscribe({
        next: (data) => {
          this.estudiante = data;
          this.cargarMateriasDisponibles();
          this.loading = false;
        },
        error: (err: any) => {
          this.errorMsg = 'Error al cargar los datos del estudiante';
          this.loading = false;
        }
      });
  }

  cargarMateriasDisponibles(): void {
    this.materiaService.getMaterias()
      .subscribe({
        next: (data) => {
          this.materiasDisponibles = data.filter(materia => 
            !(this.estudiante?.materias?.some((m: { id: number; }) => m.id === materia.id))
          );
        },
        error: (error) => {
          this.errorMsg = 'Error al cargar materias disponibles. ' + (error.error?.message || error.message);
        }
      });
  }

  matricularMateria(materiaId: string): void {
    if (!materiaId) return;
    
    this.loading = true;
    this.estudianteService.agregarMateriaAEstudiante(this.estudianteId, materiaId)
      .subscribe({
        next: (response) => {
          this.cargarEstudiante(); // Recargar datos con las materias actualizadas
        },
        error: (err: any) => {
          this.errorMsg = 'Error al matricular la materia';
          this.loading = false;
        }
      });
  }

  retirarMateria(materiaId: string): void {
    if (confirm('¿Está seguro de retirar esta materia?')) {
      this.loading = true;
      this.estudianteService.retirarMateriaDeEstudiante(this.estudianteId, materiaId)
        .subscribe({
          next: (response) => {
            this.cargarEstudiante(); // Recargar datos con las materias actualizadas
          },
          error: (err: any) => {
            this.errorMsg = 'Error al retirar la materia';
            this.loading = false;
          }
        });
    }
  }

  volver(): void {
    this.router.navigate(['/estudiantes']);
  }
}