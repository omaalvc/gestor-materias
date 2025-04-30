import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isMenuCollapsed = true;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Usar currentUser$ en lugar de currentUser
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  
  isEstudiante(): boolean {
    // Usar el método getCurrentUser() para obtener el valor actual
    return this.authService.getCurrentUser()?.role === 'Estudiante';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}