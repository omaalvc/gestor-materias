import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Materia {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  creditos: number;
  estudiantes?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  private apiUrl = `${environment.apiUrl}/Materias`;

  constructor(private http: HttpClient) { }

  getMaterias(): Observable<Materia[]> {
    return this.http.get<Materia[]>(this.apiUrl);
  }

  getMateria(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createMateria(materia: Materia): Observable<any> {
    return this.http.post<any>(this.apiUrl, materia);
  }

  updateMateria(materia: Materia): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${materia.id}`, materia);
  }

  deleteMateria(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}