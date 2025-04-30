import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // Importamos NavbarComponent para poder usarlo en la plantilla
  imports: [RouterOutlet, NavbarComponent],
  // Como ahora estamos usando imports, necesitamos definir que es standalone
  standalone: true
})
export class AppComponent {
  title = 'gestor-materias';
}
