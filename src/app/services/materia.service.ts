import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Materia {
  id: number;
  nombre: string;
  descripcion: string;
  creditos: number;
  profesor?: {
    id: number;
    nombre: string;
  };
  estudiantes?: {
    id: number;
    nombre: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  private apiUrl = `${environment.apiUrl}/Materias`;
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Método privado para obtener los headers con el token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('Error obteniendo materias:', error);
          return throwError(() => new Error('Error al obtener la lista de materias.'));
        })
      );
  }

  getMateria(id: number): Observable<Materia> {
    return this.http.get<Materia>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('Error obteniendo detalle de materia:', error);
          return throwError(() => new Error('Error al obtener el detalle de la materia.'));
        })
      );
  }

  createMateria(materia: Materia): Observable<Materia> {
    return this.http.post<Materia>(this.apiUrl, materia, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('Error al crear materia:', error);
          return throwError(() => new Error('Error al crear la materia.'));
        })
      );
  }

  updateMateria(materia: Materia): Observable<any> {
    return this.http.put(`${this.apiUrl}/${materia.id}`, materia, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('Error al actualizar materia:', error);
          return throwError(() => new Error('Error al actualizar la materia.'));
        })
      );
  }

  deleteMateria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('Error al eliminar materia:', error);
          return throwError(() => new Error('Error al eliminar la materia.'));
        })
      );
  }

  // Matricular estudiante en materia
  matricularEstudiante(materiaId: number, estudianteId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${materiaId}/estudiantes/${estudianteId}`, {}, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('Error al matricular estudiante:', error);
          return throwError(() => new Error('Error al matricular estudiante en la materia.'));
        })
      );
  }

  // Remover estudiante de materia
  removerEstudiante(materiaId: number, estudianteId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${materiaId}/estudiantes/${estudianteId}`, { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error('Error al remover estudiante:', error);
          return throwError(() => new Error('Error al remover estudiante de la materia.'));
        })
      );
  }
}