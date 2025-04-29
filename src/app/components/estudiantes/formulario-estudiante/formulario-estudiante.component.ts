import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EstudianteService } from '../../../services/estudiante.service';

interface Estudiante {
  id?: number;
  nombre: string;
  email: string;
}

@Component({
  selector: 'app-formulario-estudiante',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './formulario-estudiante.component.html',
  styleUrls: ['./formulario-estudiante.component.css']
})
export class FormularioEstudianteComponent implements OnInit {
  estudianteForm: FormGroup;
  estudianteId: number | null = null;
  modoEdicion: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';
  
  constructor(
    private fb: FormBuilder,
    private estudianteService: EstudianteService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.estudianteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.estudianteId = +params['id'];
        this.modoEdicion = true;
        this.cargarEstudiante();
      }
    });
  }
  
  cargarEstudiante(): void {
    if (this.estudianteId) {
      this.loading = true;
      this.estudianteService.getEstudiante(this.estudianteId)
        .subscribe({
          next: (data) => {
            this.estudianteForm.patchValue({
              nombre: data.estudiante.nombre,
              email: data.estudiante.email
            });
            this.loading = false;
          },
          error: (error) => {
            this.errorMessage = 'Error al cargar el estudiante. ' + (error.error?.message || error.message);
            this.loading = false;
          }
        });
    }
  }
  
  onSubmit(): void {
    if (this.estudianteForm.invalid) {
      return;
    }
    
    const estudiante: Estudiante = {
      nombre: this.estudianteForm.value.nombre,
      email: this.estudianteForm.value.email
    };
    
    this.loading = true;
    
    if (this.modoEdicion && this.estudianteId) {
      // Actualizar estudiante existente
      this.estudianteService.updateEstudiante(this.estudianteId, estudiante)
        .subscribe({
          next: () => {
            this.router.navigate(['/estudiantes', this.estudianteId]);
          },
          error: (error) => {
            this.errorMessage = 'Error al actualizar el estudiante. ' + (error.error?.message || error.message);
            this.loading = false;
          }
        });
    } else {
      // Crear nuevo estudiante
      this.estudianteService.createEstudiante(estudiante)
        .subscribe({
          next: (nuevoEstudiante) => {
            this.router.navigate(['/estudiantes', nuevoEstudiante.id]);
          },
          error: (error) => {
            this.errorMessage = 'Error al crear el estudiante. ' + (error.error?.message || error.message);
            this.loading = false;
          }
        });
    }
  }
  
  cancelar(): void {
    if (this.modoEdicion && this.estudianteId) {
      this.router.navigate(['/estudiantes', this.estudianteId]);
    } else {
      this.router.navigate(['/estudiantes']);
    }
  }
}