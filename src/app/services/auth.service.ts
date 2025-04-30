import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    username: string;
    email: string;
    fullName: string;
    role: string;
    id: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/Auth`;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    // Intenta recuperar el usuario del localStorage al inicializar
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          if (response && response.success && response.token) {
            // Guarda el token y la información del usuario en localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            
            // Actualiza el BehaviorSubject con el usuario actual
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  logout(): void {
    // Elimina el token y el usuario del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    
    // Actualiza el BehaviorSubject
    this.currentUserSubject.next(null);
    
    // Redirige al login
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser && currentUser.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('Administrador');
  }
}