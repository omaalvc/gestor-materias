import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MateriaService } from '../../../services/materia.service';
import { EstudianteService } from '../../../services/estudiante.service';

@Component({
  selector: 'app-registro-materias',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro-materias.component.html',
  styleUrls: ['./registro-materias.component.css']
})
export class RegistroMateriasComponent implements OnInit {
  materiasDisponibles: any[] = [];
  materiasRegistradas: any[] = [];
  loading: boolean = false;
  estudianteId: string = '';
  mensajeExito: string = '';
  mensajeError: string = '';
  mostrarModalCambio = false;
  materiaActual: any = null;

  constructor(
    private materiaService: MateriaService,
    private estudianteService: EstudianteService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.cargarDatosEstudiante();
  }

  cargarDatosEstudiante(): void {
    // Obtener el ID del estudiante actual desde el servicio de autenticación o localStorage
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      const user = JSON.parse(userString);
      this.estudianteId = user.estudianteId;
      
      // Cargar las materias del estudiante
      this.estudianteService.getEstudiante(this.estudianteId).subscribe({
        next: (estudiante) => {
          this.materiasRegistradas = estudiante.materias || [];
          this.cargarMateriasDisponibles();
        },
        error: (error: any) => {
          this.mostrarError('Error al cargar datos del estudiante');
          this.loading = false;
        }
      });
    } else {
      this.mostrarError('No se encontró información del usuario');
      this.loading = false;
    }
  }

  cargarMateriasDisponibles(): void {
    this.materiaService.getMaterias().subscribe({
      next: (materias) => {
        // Obtener los IDs de profesores ya asignados
        const profesoresAsignados = this.materiasRegistradas
          .map(m => m.profesor?.id)
          .filter(id => id != null);

        // Filtrar materias que no estén registradas y cuyos profesores no estén asignados
        this.materiasDisponibles = materias.filter((materia: any) => {
          const noEstaRegistrada = !this.materiasRegistradas.some(m => m.id === materia.id);
          const profesorNoAsignado = !profesoresAsignados.includes(materia.profesor?.id);
          return noEstaRegistrada && profesorNoAsignado;
        });
        
        this.loading = false;
      },
      error: (error: any) => {
        this.mostrarError('Error al cargar materias disponibles');
        this.loading = false;
      }
    });
  }

  registrarMateria(materia: any): void {
    // Verificar si ya tiene una materia con el mismo profesor
    const profesorExistente = this.materiasRegistradas.find(m => 
      m.profesor?.id === materia.profesor?.id
    );

    if (profesorExistente) {
      this.mostrarError(`No puedes inscribir esta materia porque ya tienes una materia con el profesor ${materia.profesor.nombre}`);
      return;
    }

    this.loading = true;
    this.limpiarMensajes();
    
    this.materiaService.matricularEstudiante(materia.id, parseInt(this.estudianteId)).subscribe({
      next: () => {
        this.materiasRegistradas.push(materia);
        this.materiasDisponibles = this.materiasDisponibles.filter(m => m.id !== materia.id);
        this.mostrarExito(`Materia "${materia.nombre}" registrada correctamente`);
        this.loading = false;
      },
      error: (error: any) => {
        this.mostrarError(error.message || 'Error al registrar la materia');
        this.loading = false;
      }
    });
  }

  retirarMateria(materia: any): void {
    this.loading = true;
    this.limpiarMensajes();
    
    this.estudianteService.retirarMateriaDeEstudiante(this.estudianteId, materia.id).subscribe({
      next: () => {
        this.materiasRegistradas = this.materiasRegistradas.filter((m: any) => m.id !== materia.id);
        // Recargar materias disponibles para actualizar la lista correctamente
        this.cargarMateriasDisponibles();
        this.mostrarExito(`Materia "${materia.nombre}" retirada correctamente`);
        this.loading = false;
      },
      error: (error: any) => {
        this.mostrarError('Error al retirar la materia');
        this.loading = false;
      }
    });
  }

  editarMateria(materia: any): void {
    this.materiaActual = materia;
    this.mostrarModalCambio = true;
  }

  cerrarModal(): void {
    this.mostrarModalCambio = false;
    this.materiaActual = null;
  }

  seleccionarNuevaMateria(nuevaMateria: any): void {
    if (!this.materiaActual || !this.estudianteId) return;

    this.loading = true;
    this.limpiarMensajes();

    // Primero retiramos la materia actual
    this.estudianteService.retirarMateriaDeEstudiante(this.estudianteId, this.materiaActual.id)
      .subscribe({
        next: () => {
          // Luego inscribimos la nueva materia
          this.estudianteService.agregarMateriaAEstudiante(this.estudianteId, nuevaMateria.id)
            .subscribe({
              next: () => {
                this.mensajeExito = 'Materia cambiada exitosamente';
                this.cerrarModal();
                this.cargarDatosEstudiante();
              },
              error: (error) => {
                this.mensajeError = error.error?.message || 'Error al inscribir la nueva materia';
                this.loading = false;
              }
            });
        },
        error: (error) => {
          this.mensajeError = error.error?.message || 'Error al retirar la materia actual';
          this.loading = false;
        }
      });
  }

  mostrarExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    setTimeout(() => {
      this.mensajeExito = '';
    }, 5000); // Ocultar después de 5 segundos
  }

  mostrarError(mensaje: string): void {
    this.mensajeError = mensaje;
    setTimeout(() => {
      this.mensajeError = '';
    }, 5000); // Ocultar después de 5 segundos
  }

  limpiarMensajes(): void {
    this.mensajeExito = '';
    this.mensajeError = '';
  }
}