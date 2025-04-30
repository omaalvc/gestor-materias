import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function authGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  console.log('=== AuthGuard Iniciado ===');
  console.log('URL solicitada:', state.url);
  console.log('Ruta completa:', route.url);
  console.log('Parámetros de ruta:', route.params);
  
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const isAuthenticated = authService.isAuthenticated();
  console.log('¿Usuario autenticado?:', isAuthenticated);

  // Verificar si es ruta de detalle de materia
  const isDetalleMateria = state.url.startsWith('/materias/view/');
  console.log('¿Es ruta de detalle de materia?:', isDetalleMateria);

  if (isDetalleMateria) {
    console.log('Permitiendo acceso a detalle de materia sin autenticación');
    return true;
  }

  if (!isAuthenticated) {
    console.log('Usuario no autenticado, redirigiendo a login');
    router.navigate(['/login']);
    return false;
  }

  console.log('Acceso permitido');
  console.log('=== AuthGuard Finalizado ===');
  return true;
}