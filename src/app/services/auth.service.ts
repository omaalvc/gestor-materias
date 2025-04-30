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

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.token) {
            const user = {
              id: response.user.id,
              estudianteId: response.user.estudianteId,
              username: response.user.username,
              role: response.user.role,
              token: response.token
            };
            console.log('Usuario almacenado:', user);
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
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