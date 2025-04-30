import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MateriaService, Materia } from '../../../services/materia.service';

@Component({
  selector: 'app-detalle-materia',
  templateUrl: './detalle-materia.component.html',
  styleUrls: ['./detalle-materia.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class DetalleMateriaComponent implements OnInit {
  materiaId: number = 0;
  materia: Materia | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private materiaService: MateriaService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.materiaId = +params['id'];
      if (this.materiaId) {
        this.cargarMateria();
      }
    });
  }

  cargarMateria(): void {
    this.loading = true;
    this.materiaService.getMateria(this.materiaId)
      .subscribe({
        next: (data) => {
          console.log('Materia cargada:', data);
          this.materia = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar materia:', error);
          this.error = 'Error al cargar la información de la materia. Por favor intente nuevamente.';
          this.loading = false;
        }
      });
  }

  volver(): void {
    this.router.navigate(['/admin/materias']);
  }
}