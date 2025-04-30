import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EstudianteService } from '../../../services/estudiante.service';
import { MateriaService } from '../../../services/materia.service';
import { Estudiante } from '../../../models/estudiante.interface';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detalle-estudiante',
  templateUrl: './detalle-estudiante.component.html',
  styleUrls: ['./detalle-estudiante.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DetalleEstudianteComponent implements OnInit {
  estudianteId: string = '';
  materiaId: string | null = null;
  estudiante: Estudiante | null = null;
  materiasDisponibles: any[] = [];
  loading = false;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private estudianteService: EstudianteService,
    private materiaService: MateriaService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.estudianteId = id;
        this.materiaId = this.route.snapshot.queryParamMap.get('materiaId');
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
    if (this.materiaId) {
      this.router.navigate(['/admin/materias/view', this.materiaId]);
    } else {
      this.location.back();
    }
  }
}