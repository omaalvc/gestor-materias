import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MateriaService, Materia } from '../../../services/materia.service';

@Component({
  selector: 'app-lista-materias',
  templateUrl: './lista-materias.component.html',
  styleUrls: ['./lista-materias.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ListaMateriasComponent implements OnInit {
  materias: Materia[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private materiaService: MateriaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarMaterias();
  }

  cargarMaterias(): void {
    this.loading = true;
    this.error = null;

    this.materiaService.getMaterias().subscribe({
      next: (data) => {
        this.materias = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando materias:', err);
        this.error = 'Error al cargar las materias. Por favor intente nuevamente.';
        this.loading = false;
      }
    });
  }

  verDetalle(id: number): void {
    this.router.navigate(['/admin/materias/view', id]);
  }

  editarMateria(id: number): void {
    this.router.navigate(['/admin/materias/edit', id]);
  }

  eliminarMateria(id: number): void {
    if (confirm('¿Está seguro de eliminar esta materia?')) {
      this.materiaService.deleteMateria(id).subscribe({
        next: () => {
          this.cargarMaterias();
        },
        error: (err) => {
          console.error('Error eliminando materia:', err);
          this.error = 'Error al eliminar la materia. Por favor intente nuevamente.';
        }
      });
    }
  }

  nuevaMateria(): void {
    this.router.navigate(['/admin/materias/crear']);
  }
}