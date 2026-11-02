import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);

isUserMenuOpen = false;

toggleUserMenu(): void {
  this.isUserMenuOpen = !this.isUserMenuOpen;
}

closeUserMenu(): void {
  this.isUserMenuOpen = false;
}

navLogout(): void {
this.authService.logOut()
}
}
