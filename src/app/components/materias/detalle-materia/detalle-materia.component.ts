import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MateriaService } from '../../../services/materia.service';

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
  selector: 'app-detalle-materia',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-materia.component.html',
  styleUrls: ['./detalle-materia.component.css']
})
export class DetalleMateriaComponent implements OnInit {
  materiaId: number = 0;
  materia: Materia | null = null;
  estudiantes: Estudiante[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private materiaService: MateriaService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.materiaId = +params['id'];
      this.cargarMateria();
      this.cargarEstudiantes();
    });
  }

  cargarMateria(): void {
    this.loading = true;
    this.materiaService.getMateria(this.materiaId)
      .subscribe({
        next: (data) => {
          this.materia = data;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al cargar la materia. ' + (error.error?.message || error.message);
          this.loading = false;
        }
      });
  }

  cargarEstudiantes(): void {
    this.materiaService.getEstudiantesMateria(this.materiaId)
      .subscribe({
        next: (data) => {
          this.estudiantes = data;
        },
        error: (error) => {
          this.errorMessage = 'Error al cargar estudiantes. ' + (error.error?.message || error.message);
        }
      });
  }

  volver(): void {
    this.router.navigate(['/materias']);
  }
}