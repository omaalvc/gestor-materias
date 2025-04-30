import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Materia } from './materia.service';

export interface Estudiante {
  id: number;
  nombre: string;
  email: string;
  materias?: Materia[];
}

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = `${environment.apiUrl}/Estudiantes`;

  constructor(private http: HttpClient) { }

  getEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl);
  }

  getEstudiante(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createEstudiante(estudiante: Estudiante): Observable<any> {
    return this.http.post<any>(this.apiUrl, estudiante);
  }

  updateEstudiante(estudiante: Estudiante): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${estudiante.id}`, estudiante);
  }

  deleteEstudiante(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Métodos específicos para la matrícula de materias
  matricularEstudiante(estudianteId: number, materiaId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${estudianteId}/matricular/${materiaId}`, {});
  }

  cancelarMatricula(estudianteId: number, materiaId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${estudianteId}/cancelar/${materiaId}`);
  }
}