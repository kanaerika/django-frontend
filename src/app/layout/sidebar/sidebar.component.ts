import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  exact?: boolean;
  roles?: string[];
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() open = true;

  constructor(public auth: AuthService) {}

  navItems: NavItem[] = [
    { label: 'Tableau de bord', icon: '📊', route: '/dashboard', exact: true },
    { label: 'Statistiques', icon: '📈', route: '/stats', roles: ['Admin', 'admin'] },
    {
      label: 'Activités', icon: '🏄', route: '/activities',
      children: [
        { label: 'Liste des activités', icon: '🏄', route: '/activities', exact: true },
        { label: 'Catégories', icon: '🏷️', route: '/activities/categories' },
      ]
    },
    { label: 'Plannings', icon: '📅', route: '/schedules' },
    { label: 'Réservations', icon: '🎫', route: '/bookings' },
    { label: 'Avis', icon: '⭐', route: '/reviews' },
    {
      label: 'Destinations', icon: '🌍', route: '/destinations',
      children: [
        { label: 'Toutes', icon: '🗺️', route: '/destinations', exact: true },
        { label: 'Pays', icon: '🏳️', route: '/destinations/countries' },
        { label: 'Villes', icon: '🏙️', route: '/destinations/cities' },
      ]
    },
    {
      label: 'Hôtels', icon: '🏨', route: '/hotels',
      children: [
        { label: 'Hôtels', icon: '🏨', route: '/hotels', exact: true },
        { label: 'Destinations touristiques', icon: '📍', route: '/hotels/destinations' },
        { label: 'Réservations hôtels', icon: '🛏️', route: '/hotels/bookings' },
      ]
    },
    { label: 'Utilisateurs', icon: '👥', route: '/users', roles: ['Admin', 'admin'] },
  ];

  expandedMenus: Set<string> = new Set();

  toggleMenu(label: string) {
    if (this.expandedMenus.has(label)) this.expandedMenus.delete(label);
    else this.expandedMenus.add(label);
  }

  isExpanded(label: string) { return this.expandedMenus.has(label); }

  canSee(item: NavItem): boolean {
    if (!item.roles) return true;
    const roleName = this.auth.currentUser()?.role_name || '';
    return item.roles.includes(roleName);
  }
}
