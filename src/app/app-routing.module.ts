import { NgModule } from '@angular/core';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ListaMateriasComponent } from './components/materias/lista-materias/lista-materias.component';
import { DetalleMateriaComponent } from './components/materias/detalle-materia/detalle-materia.component';
import { ListaEstudiantesComponent } from './components/estudiantes/lista-estudiantes/lista-estudiantes.component';
import { DetalleEstudianteComponent } from './components/estudiantes/detalle-estudiante/detalle-estudiante.component';
import { FormularioEstudianteComponent } from './components/estudiantes/formulario-estudiante/formulario-estudiante.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'admin/materias', 
    component: ListaMateriasComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administrador'] }
  },
  { 
    path: 'admin/materias/view/:id', 
    component: DetalleMateriaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administrador'] }
  },
  {
    path: 'materias',
    component: ListaMateriasComponent,
    canActivate: [AuthGuard]
  },
  // Rutas para estudiantes
  {
    path: 'estudiantes',
    component: ListaEstudiantesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'estudiantes/:id',
    component: DetalleEstudianteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'estudiantes/nuevo',
    component: FormularioEstudianteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'estudiantes/editar/:id',
    component: FormularioEstudianteComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

// Mantenemos el NgModule por compatibilidad con el resto de la aplicación
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// Exportamos esta función para ser usada con provideRouter en main.ts
export const appRoutes = () => {
  return routes;
}