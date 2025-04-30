import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const currentUser = authService.getCurrentUser();
  
  if (authService.isLoggedIn()) {
    // Verificar si la ruta tiene requisitos de roles
    if (route.data['roles'] && route.data['roles'].length) {
      // Verificar si el usuario tiene el rol requerido
      if (!route.data['roles'].includes(currentUser.role)) {
        // Si el rol no coincide, redirigir a la página principal del usuario
        router.navigate(['/materias']);
        return false;
      }
    }
    
    // Autenticado y con permisos
    return true;
  }
  
  // No autenticado, redirigir al login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};