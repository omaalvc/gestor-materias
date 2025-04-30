import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MateriaService, Materia } from '../../../services/materia.service';
import { AuthService } from '../../../services/auth.service';

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
  role: string = '';

  constructor(
    private materiaService: MateriaService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.role = user.role;
      }
    });
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
    console.log('Navegando a:', `/admin/materias/view/${id}`);
    this.router.navigateByUrl(`/admin/materias/view/${id}`);
  }

  editarMateria(id: number): void {
    this.router.navigateByUrl(`/admin/materias/edit/${id}`);
  }

  nuevaMateria(): void {
    this.router.navigateByUrl('/admin/materias/crear');
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
}