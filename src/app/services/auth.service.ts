import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  username: string;
  role: string;
}

interface User {
  username: string;
  token: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Intentar cargar el usuario desde localStorage al iniciar
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(credentials: { username: string, password: string }): Observable<LoginResponse> {
    console.log('Intentando login con:', credentials.username);
    return this.http.post<LoginResponse>(`${this.apiUrl}/api/auth/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Respuesta del servidor:', response);
          if (response && response.success && response.token) {
            // Almacenar el token y los datos del usuario
            const user: User = {
              username: response.username,
              token: response.token,
              role: response.role
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  logout(): void {
    // Eliminar el usuario del almacenamiento local y actualizar el BehaviorSubject
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const currentUser = this.currentUserSubject.value;
    // Verificar si hay un usuario con token
    return !!(currentUser && currentUser.token);
  }

  getToken(): string | null {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.token ?? null;
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}