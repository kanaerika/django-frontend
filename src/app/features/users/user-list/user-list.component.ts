import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { User,Role } from '../../../core/models/auth.models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filtered: User[] = [];
  roles: Role[] = [];
  loading = true;
  search = '';

  constructor(private authService: AuthService, private toast: ToastService) {}

  ngOnInit() {
    this.authService.getRoles().subscribe({next: response => {this.roles = response.results;}
});
    this.authService.getUsers().subscribe({
      next: u => { this.users = u.results; this.filtered = u.results; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  filterUsers() {
    const q = this.search.toLowerCase();
    this.filtered = this.users.filter(u =>
      u.username.toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.full_name || '').toLowerCase().includes(q)
    );
  }

  assignRole(userId: number, roleId: number) {
    this.authService.assignRole(userId, roleId).subscribe({
      next: updated => {
        const u = this.users.find(x => x.id === userId);
        if (u) { u.role = updated.role; u.role_name = updated.role_name; }
        this.toast.success('Rôle mis à jour.');
      },
      error: () => this.toast.error('Erreur.')
    });
  }

  initials(u: User) { return (u.first_name?.[0] || u.username[0] || 'U').toUpperCase(); }
}
