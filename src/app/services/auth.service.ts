import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of, throwError, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  estudianteId?: number;
}

export interface AuthResponse {
  success?: boolean;
  token: string;
  message?: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<any>(`${this.apiUrl}/api/Auth/login`, { username, password })
      .pipe(
        tap(response => {
          console.log('Respuesta del servidor:', response);
          
          // Verificar si la respuesta tiene al menos un token
          if (response && response.token) {
            // Guardar el token en el almacenamiento local
            localStorage.setItem('token', response.token);
            
            // Decodificar el token para obtener la información del usuario
            try {
              const decodedToken: any = jwtDecode(response.token);
              
              const user: User = {
                id: parseInt(decodedToken.UserId),
                username: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
                email: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
                fullName: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'], // Ajustar si hay un claim específico para el nombre completo
                role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
                estudianteId: decodedToken.EstudianteId ? parseInt(decodedToken.EstudianteId) : undefined
              };
              
              // Guardar el usuario en el almacenamiento local
              localStorage.setItem('user', JSON.stringify(user));
              
              // Actualizar los BehaviorSubjects
              this.tokenSubject.next(response.token);
              this.currentUserSubject.next(user);
            } catch (error) {
              console.error('Error al decodificar el token:', error);
              throw new Error('Error al procesar las credenciales del usuario');
            }
          } else {
            console.error('Estructura de respuesta inválida:', response);
            throw new Error('Respuesta del servidor inválida');
          }
        })
      );
  }

  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/Account/register`, userData);
  }

  logout(): void {
    // Eliminar token y usuario del almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Actualizar los BehaviorSubjects
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'Administrador' || role === 'Admin';
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Método para validar el token actual
  validateToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false);
    }

    // Asumiendo que tienes un endpoint para validar tokens
    return this.http.get<{ valid: boolean }>(`${this.apiUrl}/Auth/validate`)
      .pipe(
        map(response => response.valid)
      );
  }
}