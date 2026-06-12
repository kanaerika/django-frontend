import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Output() menuToggle = new EventEmitter<void>();
  dropdownOpen = false;

  constructor(public auth: AuthService) {}

  toggle() { this.menuToggle.emit(); }
  toggleDropdown() { this.dropdownOpen = !this.dropdownOpen; }
  closeDropdown() { setTimeout(() => this.dropdownOpen = false, 150); }
  logout() {console.log('Logout appelé'); this.auth.logout(); }
}
