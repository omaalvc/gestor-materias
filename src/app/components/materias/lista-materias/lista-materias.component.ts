import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MateriaService } from '../../../services/materia.service';
import { AuthService } from '../../../services/auth.service';

interface Materia {
  id?: number;
  nombre: string;
  descripcion: string;
  creditos: number;
}

@Component({
  selector: 'app-lista-materias',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-materias.component.html',
  styleUrls: ['./lista-materias.component.css']
})
export class ListaMateriasComponent implements OnInit {
  materias: Materia[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  isAdmin: boolean = false;
  
  constructor(
    private materiaService: MateriaService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarMaterias();
    this.authService.currentUser.subscribe(user => {
      this.isAdmin = user?.role === 'Admin';
    });
  }

  cargarMaterias(): void {
    this.loading = true;
    this.materiaService.getMaterias()
      .subscribe({
        next: (data) => {
          this.materias = data;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al cargar materias. ' + (error.error?.message || error.message);
          this.loading = false;
        }
      });
  }

  verDetalle(id: number): void {
    this.router.navigate(['/materias', id]);
  }

  nuevaMateria(): void {
    this.router.navigate(['/materias/nueva']);
  }

  editarMateria(id: number): void {
    this.router.navigate(['/materias/editar', id]);
  }

  eliminarMateria(id: number): void {
    if (confirm('¿Está seguro de eliminar esta materia?')) {
      this.materiaService.deleteMateria(id)
        .subscribe({
          next: () => {
            this.materias = this.materias.filter(m => m.id !== id);
          },
          error: (error) => {
            this.errorMessage = 'Error al eliminar materia. ' + (error.error?.message || error.message);
          }
        });
    }
  }
}