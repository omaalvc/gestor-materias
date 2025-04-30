import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  private apiUrl = `${environment.apiUrl}/api/auth`;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;
  
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(this.getStoredUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          if (response && response.success && response.token) {
            // Guarda el token y la información del usuario en localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            
            // Actualiza el BehaviorSubject con el usuario actual
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError(error => {
          console.error('Error en el login', error);
          return of(null);
        })
      );
  }

  logout(): void {
    // Eliminar token y usuario del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    
    // Actualizar el BehaviorSubject con null
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getStoredUser(): any {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user && user.role === 'Administrador';
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser() && !!this.getToken();
  }
}