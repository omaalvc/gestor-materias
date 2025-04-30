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
      this.estudianteId = user.id;
      
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
        // Filtrar las materias que el estudiante no tiene registradas
        const materiasIds = this.materiasRegistradas.map((m: any) => m.id);
        this.materiasDisponibles = materias.filter((m: any) => !materiasIds.includes(m.id));
        this.loading = false;
      },
      error: (error: any) => {
        this.mostrarError('Error al cargar materias disponibles');
        this.loading = false;
      }
    });
  }

  registrarMateria(materia: any): void {
    this.loading = true;
    this.limpiarMensajes();
    
    // Agregar la materia a las materias del estudiante
    this.estudianteService.agregarMateriaAEstudiante(this.estudianteId, materia.id).subscribe({
      next: () => {
        // Mover la materia de disponibles a registradas
        this.materiasRegistradas.push(materia);
        this.materiasDisponibles = this.materiasDisponibles.filter(m => m.id !== materia.id);
        
        this.mostrarExito(`Materia "${materia.nombre}" registrada correctamente`);
        this.loading = false;
      },
      error: (error: any) => {
        this.mostrarError('Error al registrar la materia');
        this.loading = false;
      }
    });
  }

  retirarMateria(materia: any): void {
    this.loading = true;
    this.limpiarMensajes();
    
    // Retirar la materia de las materias del estudiante
    this.estudianteService.retirarMateriaDeEstudiante(this.estudianteId, materia.id).subscribe({
      next: () => {
        // Mover la materia de registradas a disponibles
        this.materiasDisponibles.push(materia);
        this.materiasRegistradas = this.materiasRegistradas.filter((m: any) => m.id !== materia.id);
        
        this.mostrarExito(`Materia "${materia.nombre}" retirada correctamente`);
        this.loading = false;
      },
      error: (error: any) => {
        this.mostrarError('Error al retirar la materia');
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