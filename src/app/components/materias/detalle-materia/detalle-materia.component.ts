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
  materia: Materia | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private materiaService: MateriaService
  ) { }

  ngOnInit(): void {
    console.log('DetalleMateriaComponent - ngOnInit');
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID from route:', id);

    if (id) {
      this.cargarMateria(+id);
    } else {
      this.error = 'ID de materia no proporcionado';
      this.loading = false;
    }
  }

  cargarMateria(id: number): void {
    console.log('Cargando materia con ID:', id);
    this.materiaService.getMateria(id).subscribe({
      next: (data) => {
        console.log('Datos de materia recibidos:', data);
        this.materia = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando materia:', error);
        this.error = 'Error al cargar la información de la materia';
        this.loading = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/materias']);
  }
}