import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Estudiante {
  id?: number;
  nombre: string;
  email: string;
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

  createEstudiante(estudiante: Estudiante): Observable<Estudiante> {
    return this.http.post<Estudiante>(this.apiUrl, estudiante);
  }

  updateEstudiante(id: number, estudiante: Estudiante): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, estudiante);
  }

  deleteEstudiante(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Métodos para manejar la matrícula de estudiantes en materias
  matricularEstudiante(estudianteId: number, materiaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${estudianteId}/materias/${materiaId}`, {});
  }

  cancelarMatricula(estudianteId: number, materiaId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${estudianteId}/materias/${materiaId}`);
  }

  // Obtener compañeros de clase
  getCompaneros(estudianteId: number, materiaId: number): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.apiUrl}/${estudianteId}/companeros/${materiaId}`);
  }
}