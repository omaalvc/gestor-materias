import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MateriaService } from '../../../services/materia.service';

interface Materia {
  id?: number;
  nombre: string;
  descripcion: string;
  creditos: number;
}

@Component({
  selector: 'app-formulario-materia',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './formulario-materia.component.html',
  styleUrls: ['./formulario-materia.component.css']
})
export class FormularioMateriaComponent implements OnInit {
  materiaForm: FormGroup;
  materiaId: number | null = null;
  modoEdicion: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';
  
  constructor(
    private fb: FormBuilder,
    private materiaService: MateriaService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.materiaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required]],
      creditos: ['', [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.materiaId = +params['id'];
        this.modoEdicion = true;
        this.cargarMateria();
      }
    });
  }
  
  cargarMateria(): void {
    if (this.materiaId) {
      this.loading = true;
      this.materiaService.getMateria(this.materiaId)
        .subscribe({
          next: (data) => {
            this.materiaForm.patchValue({
              nombre: data.nombre,
              descripcion: data.descripcion,
              creditos: data.creditos
            });
            this.loading = false;
          },
          error: (error) => {
            this.errorMessage = 'Error al cargar la materia. ' + (error.error?.message || error.message);
            this.loading = false;
          }
        });
    }
  }
  
  onSubmit(): void {
    if (this.materiaForm.invalid) {
      return;
    }
    
    const materia: Materia = {
      nombre: this.materiaForm.value.nombre,
      descripcion: this.materiaForm.value.descripcion,
      creditos: this.materiaForm.value.creditos
    };
    
    this.loading = true;
    
    if (this.modoEdicion && this.materiaId) {
      // Actualizar materia existente
      this.materiaService.updateMateria(this.materiaId, materia)
        .subscribe({
          next: () => {
            this.router.navigate(['/materias', this.materiaId]);
          },
          error: (error) => {
            this.errorMessage = 'Error al actualizar la materia. ' + (error.error?.message || error.message);
            this.loading = false;
          }
        });
    } else {
      // Crear nueva materia
      this.materiaService.createMateria(materia)
        .subscribe({
          next: (nuevaMateria) => {
            this.router.navigate(['/materias', nuevaMateria.id]);
          },
          error: (error) => {
            this.errorMessage = 'Error al crear la materia. ' + (error.error?.message || error.message);
            this.loading = false;
          }
        });
    }
  }
  
  cancelar(): void {
    if (this.modoEdicion && this.materiaId) {
      this.router.navigate(['/materias', this.materiaId]);
    } else {
      this.router.navigate(['/materias']);
    }
  }
}