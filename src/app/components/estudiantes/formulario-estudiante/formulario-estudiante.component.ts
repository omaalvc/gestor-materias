import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { EstudianteService } from '../../../services/estudiante.service';

@Component({
  selector: 'app-formulario-estudiante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './formulario-estudiante.component.html',
  styleUrls: ['./formulario-estudiante.component.css']
})
export class FormularioEstudianteComponent implements OnInit {
  estudianteForm: FormGroup;
  modoEdicion = false;
  loading = false;
  errorMessage = '';
  estudianteId: string = '';

  constructor(
    private fb: FormBuilder,
    private estudianteService: EstudianteService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.estudianteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      telefono: [''],
      direccion: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.modoEdicion = true;
        this.estudianteId = params['id'];
        this.cargarEstudiante();
      }
    });
  }

  cargarEstudiante(): void {
    this.loading = true;
    this.estudianteService.getEstudiante(this.estudianteId).subscribe({
      next: (estudiante) => {
        this.estudianteForm.patchValue(estudiante);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los datos del estudiante';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.estudianteForm.valid) {
      this.loading = true;
      const estudiante = this.estudianteForm.value;

      const request = this.modoEdicion ?
        this.estudianteService.actualizarEstudiante(this.estudianteId, estudiante) :
        this.estudianteService.crearEstudiante(estudiante);

      request.subscribe({
        next: () => {
          this.router.navigate(['/estudiantes']);
        },
        error: (error) => {
          this.errorMessage = 'Error al guardar el estudiante';
          this.loading = false;
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/estudiantes']);
  }
}