import { Component, OnInit } from '@angular/core';
import { MateriaService, Materia } from '../../../../services/materia.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-materias-list',
  templateUrl: './materias-list.component.html',
  styleUrls: ['./materias-list.component.css'],
  standalone: false
})
export class MateriasListComponent implements OnInit {
  materias: Materia[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private materiaService: MateriaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMaterias();
  }

  loadMaterias(): void {
    this.loading = true;
    this.materiaService.getMaterias().subscribe({
      next: (materias) => {
        this.materias = materias;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar materias:', error);
        this.errorMessage = 'Error al cargar las materias. Por favor, inténtalo de nuevo.';
        this.loading = false;
      }
    });
  }

  deleteMateria(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta materia?')) {
      this.materiaService.deleteMateria(id).subscribe({
        next: () => {
          this.materias = this.materias.filter(materia => materia.id !== id);
        },
        error: (error) => {
          console.error('Error al eliminar materia:', error);
          this.errorMessage = 'Error al eliminar la materia. Por favor, inténtalo de nuevo.';
        }
      });
    }
  }

  editMateria(id: number): void {
    this.router.navigate(['/admin/materias/edit', id]);
  }

  viewMateria(id: number): void {
    this.router.navigate(['/admin/materias/view', id]);
  }
}