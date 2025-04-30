import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Estudiante } from '../models/estudiante.interface';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = `${environment.apiUrl}/estudiantes`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl);
  }

  getEstudiante(id: string): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.apiUrl}/${id}`);
  }

  crearEstudiante(estudiante: Estudiante): Observable<Estudiante> {
    return this.http.post<Estudiante>(this.apiUrl, estudiante);
  }

  actualizarEstudiante(id: string, estudiante: Estudiante): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${this.apiUrl}/${id}`, estudiante);
  }

  eliminarEstudiante(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Métodos para el registro de materias
  agregarMateriaAEstudiante(estudianteId: string, materiaId: string): Observable<Estudiante> {
    return this.http.post<Estudiante>(`${this.apiUrl}/${estudianteId}/materias`, { materiaId });
  }

  retirarMateriaDeEstudiante(estudianteId: string, materiaId: string): Observable<Estudiante> {
    return this.http.delete<Estudiante>(`${this.apiUrl}/${estudianteId}/materias/${materiaId}`);
  }
}