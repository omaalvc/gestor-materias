import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MateriaService, Materia } from '../../../../services/materia.service';

@Component({
  selector: 'app-materia-form',
  templateUrl: './materia-form.component.html',
  styleUrls: ['./materia-form.component.css'],
  standalone: false
})
export class MateriaFormComponent implements OnInit {
  materiaForm: FormGroup;
  isEditMode = false;
  materiaId: number | null = null;
  loading = false;
  submitted = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private materiaService: MateriaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.materiaForm = this.fb.group({
      nombre: ['', [Validators.required]],
      codigo: ['', [Validators.required, Validators.pattern('[A-Za-z0-9]{3,10}')]],
      creditos: [0, [Validators.required, Validators.min(1), Validators.max(10)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.materiaId = +params['id'];
        this.loadMateria(this.materiaId);
      }
    });
  }

  loadMateria(id: number): void {
    this.loading = true;
    this.materiaService.getMateria(id).subscribe({
      next: (response) => {
        this.materiaForm.patchValue({
          nombre: response.materia.nombre,
          codigo: response.materia.codigo,
          creditos: response.materia.creditos,
          descripcion: response.materia.descripcion
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar materia:', error);
        this.errorMessage = 'Error al cargar los datos de la materia.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.materiaForm.invalid) {
      return;
    }

    const materiaData: Materia = {
      id: this.materiaId || 0,
      ...this.materiaForm.value
    };

    this.loading = true;

    if (this.isEditMode && this.materiaId) {
      this.materiaService.updateMateria(materiaData).subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(['/admin/materias']);
        },
        error: (error) => {
          console.error('Error al actualizar materia:', error);
          this.errorMessage = 'Error al actualizar la materia.';
          this.loading = false;
        }
      });
    } else {
      this.materiaService.createMateria(materiaData).subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(['/admin/materias']);
        },
        error: (error) => {
          console.error('Error al crear materia:', error);
          this.errorMessage = 'Error al crear la materia.';
          this.loading = false;
        }
      });
    }
  }

  get f() {
    return this.materiaForm.controls;
  }
}