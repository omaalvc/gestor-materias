import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Materia, Estudiante } from '../models/estudiante.model';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  private apiUrl = 'http://localhost:5000/api/Materias';

  constructor(private http: HttpClient) { }

  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(this.apiUrl);
  }

  getMateria(id: number): Observable<Materia> {
    return this.http.get<Materia>(`${this.apiUrl}/${id}`);
  }

  createMateria(materia: Materia): Observable<Materia> {
    return this.http.post<Materia>(this.apiUrl, materia);
  }

  updateMateria(id: number, materia: Materia): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, materia);
  }

  deleteMateria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getEstudiantesMateria(id: number): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.apiUrl}/${id}/estudiantes`);
  }
}