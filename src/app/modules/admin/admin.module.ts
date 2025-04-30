import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { MateriasListComponent } from './components/materias-list/materias-list.component';
import { MateriaFormComponent } from './components/materia-form/materia-form.component';
import { MateriaDetailComponent } from './components/materia-detail/materia-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: AdminDashboardComponent
  },
  {
    path: 'materias',
    component: MateriasListComponent
  },
  {
    path: 'materias/new',
    component: MateriaFormComponent
  },
  {
    path: 'materias/edit/:id',
    component: MateriaFormComponent
  },
  {
    path: 'materias/view/:id',
    component: MateriaDetailComponent
  }
];

@NgModule({
  declarations: [
    AdminDashboardComponent,
    MateriasListComponent,
    MateriaFormComponent,
    MateriaDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule { }