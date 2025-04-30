import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      // Verificar si la ruta requiere roles específicos
      if (route.data['roles'] && route.data['roles'].length) {
        // Verificar si el usuario tiene alguno de los roles requeridos
        const userRole = this.authService.getUserRole();
        if (route.data['roles'].indexOf(userRole) === -1) {
          // Si no tiene el rol requerido, redirigir a la página de inicio
          this.router.navigate(['/']);
          return false;
        }
      }
      
      // Autorizado, retornar verdadero
      return true;
    }
    
    // No está autenticado, redirigir al login
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}