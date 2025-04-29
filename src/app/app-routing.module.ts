import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListaEstudiantesComponent } from './components/estudiantes/lista-estudiantes/lista-estudiantes.component';
import { DetalleEstudianteComponent } from './components/estudiantes/detalle-estudiante/detalle-estudiante.component';
import { FormularioEstudianteComponent } from './components/estudiantes/formulario-estudiante/formulario-estudiante.component';
import { ListaMateriasComponent } from './components/materias/lista-materias/lista-materias.component';
import { DetalleMateriaComponent } from './components/materias/detalle-materia/detalle-materia.component';
import { FormularioMateriaComponent } from './components/materias/formulario-materia/formulario-materia.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'estudiantes', 
    component: ListaEstudiantesComponent, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'estudiantes/nuevo', 
    component: FormularioEstudianteComponent, 
    canActivate: [AuthGuard],
    data: { role: 'Admin' }
  },
  { 
    path: 'estudiantes/:id', 
    component: DetalleEstudianteComponent, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'estudiantes/editar/:id', 
    component: FormularioEstudianteComponent, 
    canActivate: [AuthGuard],
    data: { role: 'Admin' }
  },
  { 
    path: 'materias', 
    component: ListaMateriasComponent, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'materias/nueva', 
    component: FormularioMateriaComponent, 
    canActivate: [AuthGuard],
    data: { role: 'Admin' }
  },
  { 
    path: 'materias/:id', 
    component: DetalleMateriaComponent, 
    canActivate: [AuthGuard]
  },
  { 
    path: 'materias/editar/:id', 
    component: FormularioMateriaComponent, 
    canActivate: [AuthGuard],
    data: { role: 'Admin' }
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }