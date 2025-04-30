import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MateriaService } from '../../../../services/materia.service';

@Component({
  selector: 'app-materia-detail',
  templateUrl: './materia-detail.component.html',
  styleUrls: ['./materia-detail.component.css'],
  standalone: false
})
export class MateriaDetailComponent implements OnInit {
  materiaId: number = 0;
  materia: any = null;
  estudiantes: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private materiaService: MateriaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.materiaId = +params['id'];
        this.loadMateria(this.materiaId);
      } else {
        this.router.navigate(['/admin/materias']);
      }
    });
  }

  loadMateria(id: number): void {
    this.loading = true;
    this.materiaService.getMateria(id).subscribe({
      next: (response) => {
        this.materia = response.materia;
        this.estudiantes = response.estudiantes || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar materia:', error);
        this.errorMessage = 'Error al cargar los datos de la materia.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/materias']);
  }

  editMateria(): void {
    this.router.navigate(['/admin/materias/edit', this.materiaId]);
  }

  deleteMateria(): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta materia?')) {
      this.loading = true;
      this.materiaService.deleteMateria(this.materiaId).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/admin/materias']);
        },
        error: (error) => {
          console.error('Error al eliminar materia:', error);
          this.errorMessage = 'Error al eliminar la materia.';
          this.loading = false;
        }
      });
    }
  }
}