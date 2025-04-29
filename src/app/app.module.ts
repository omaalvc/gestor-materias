import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
// Importamos todos los componentes excepto AppComponent que ahora se maneja como standalone
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ListaEstudiantesComponent } from './components/estudiantes/lista-estudiantes/lista-estudiantes.component';
import { DetalleEstudianteComponent } from './components/estudiantes/detalle-estudiante/detalle-estudiante.component';
import { FormularioEstudianteComponent } from './components/estudiantes/formulario-estudiante/formulario-estudiante.component';
import { ListaMateriasComponent } from './components/materias/lista-materias/lista-materias.component';
import { DetalleMateriaComponent } from './components/materias/detalle-materia/detalle-materia.component';
import { FormularioMateriaComponent } from './components/materias/formulario-materia/formulario-materia.component';
import { LoginComponent } from './components/login/login.component';

import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    // Todos los componentes son standalone, por lo que no hay componentes en declarations
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // Importamos todos los componentes standalone
    DashboardComponent,
    NavbarComponent,
    DetalleEstudianteComponent,
    ListaMateriasComponent,
    DetalleMateriaComponent,
    LoginComponent,
    FormularioMateriaComponent,
    ListaEstudiantesComponent,
    FormularioEstudianteComponent
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
  // bootstrap eliminado ya que usamos bootstrapApplication en main.ts
})
export class AppModule { }