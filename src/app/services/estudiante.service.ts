import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estudiante, Materia } from '../models/estudiante.model';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = 'http://localhost:5000/api/Estudiantes';

  constructor(private http: HttpClient) { }

  getEstudiantes(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl);
  }

  getEstudiante(id: number): Observable<{ estudiante: Estudiante, materias: Materia[] }> {
    return this.http.get<{ estudiante: Estudiante, materias: Materia[] }>(`${this.apiUrl}/${id}`);
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

  getMateriasEstudiante(id: number): Observable<Materia[]> {
    return this.http.get<Materia[]>(`${this.apiUrl}/${id}/materias`);
  }

  matricularEstudiante(estudianteId: number, materiaId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${estudianteId}/matricular/${materiaId}`, {});
  }

  cancelarMatricula(estudianteId: number, materiaId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${estudianteId}/cancelar/${materiaId}`);
  }
}