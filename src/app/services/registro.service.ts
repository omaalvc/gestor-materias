import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface IRegistroService {
  // Materia related methods
  getMaterias(): Observable<any[]>;
  getMateria(id: number): Observable<any>;
  createMateria(materia: any): Observable<any>;
  updateMateria(id: number, materia: any): Observable<any>;
  deleteMateria(id: number): Observable<any>;
  
  // Estudiante related methods
  getEstudiantes(): Observable<any[]>;
  getEstudiante(id: number): Observable<any>;
  createEstudiante(estudiante: any): Observable<any>;
  updateEstudiante(id: number, estudiante: any): Observable<any>;
  deleteEstudiante(id: number): Observable<any>;
  matricularEstudiante(estudianteId: number, materiaId: number): Observable<any>;
  cancelarMatricula(estudianteId: number, materiaId: number): Observable<any>;
}

@Injectable({
  providedIn: 'root'
})
export class RegistroService implements IRegistroService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Materia methods
  getMaterias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/materias`);
  }

  getMateria(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/materias/${id}`);
  }

  createMateria(materia: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/materias`, materia);
  }

  updateMateria(id: number, materia: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/materias/${id}`, materia);
  }

  deleteMateria(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/materias/${id}`);
  }

  // Estudiante methods
  getEstudiantes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/estudiantes`);
  }

  getEstudiante(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/estudiantes/${id}`);
  }

  createEstudiante(estudiante: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/estudiantes`, estudiante);
  }

  updateEstudiante(id: number, estudiante: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/estudiantes/${id}`, estudiante);
  }

  deleteEstudiante(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/estudiantes/${id}`);
  }

  matricularEstudiante(estudianteId: number, materiaId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/estudiantes/${estudianteId}/materias/${materiaId}`, {});
  }

  cancelarMatricula(estudianteId: number, materiaId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/estudiantes/${estudianteId}/materias/${materiaId}`);
  }
}