import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { authInterceptor } from './interceptors/auth.interceptor';
import { ListaMateriasComponent } from './components/materias/lista-materias/lista-materias.component';
import { DetalleMateriaComponent } from './components/materias/detalle-materia/detalle-materia.component';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    AppComponent,
    ListaMateriasComponent,
    DetalleMateriaComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useFactory: () => authInterceptor, multi: true }
  ],
  exports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class AppModule { }