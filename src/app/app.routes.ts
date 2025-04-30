import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListaMateriasComponent } from './components/materias/lista-materias/lista-materias.component';

import { DetalleMateriaComponent } from './components/materias/detalle-materia/detalle-materia.component';
import { RegistroMateriasComponent } from './components/estudiantes/registro-materias/registro-materias.component';
import { DetalleEstudianteComponent } from './components/estudiantes/detalle-estudiante/detalle-estudiante.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'admin',
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
      { path: 'materias', component: ListaMateriasComponent },
      { path: 'materias/view/:id', component: DetalleMateriaComponent },
      { path: 'materias/crear', component: RegistroMateriasComponent, canActivate: [authGuard] },
      { path: 'materias/edit/:id', component: RegistroMateriasComponent, canActivate: [authGuard] },
      { path: 'estudiantes/:id', component: DetalleEstudianteComponent }
    ]
  }
];
