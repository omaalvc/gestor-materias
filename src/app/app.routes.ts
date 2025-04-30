import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListaMateriasComponent } from './components/materias/lista-materias/lista-materias.component';

import { DetalleMateriaComponent } from './components/materias/detalle-materia/detalle-materia.component';
import { AuthGuard } from './guards/auth.guard';
import { RegistroMateriasComponent } from './components/estudiantes/registro-materias/registro-materias.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'materias',
        children: [
          { path: '', component: ListaMateriasComponent },
          { path: 'crear', component: RegistroMateriasComponent },
          { path: 'view/:id', component: DetalleMateriaComponent },
          { path: 'edit/:id', component: RegistroMateriasComponent }
        ]
      }
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
