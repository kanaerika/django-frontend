import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userForm: FormGroup;
  profileForm: FormGroup;
  pwdForm: FormGroup;
  loading = false;
  pwdLoading = false;
  activeTab: 'info' | 'security' = 'info';

  constructor(private fb: FormBuilder, public auth: AuthService, private toast: ToastService) {
    this.userForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      email: ['', [Validators.required, Validators.email]]
    });
    this.profileForm = this.fb.group({
      phone: [''],
      bio: ['']
    });
    this.pwdForm = this.fb.group({
      old_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      new_password2: ['', Validators.required]
    }, { validators: (g: AbstractControl) => g.get('new_password')?.value === g.get('new_password2')?.value ? null : { mismatch: true } });
  }

  ngOnInit() {
    this.auth.getMe().subscribe(u => {
      this.userForm.patchValue({ first_name: u.first_name, last_name: u.last_name, email: u.email });
    });
    this.auth.getMyProfile().subscribe(p => {
      this.profileForm.patchValue({ phone: p.phone || '', bio: p.bio || '' });
    });
  }

  saveInfo() {
    if (this.userForm.invalid) { this.userForm.markAllAsTouched(); return; }
    this.loading = true;
    this.auth.updateMe(this.userForm.value).subscribe({
      next: () => {
        const fd = new FormData();
        Object.entries(this.profileForm.value).forEach(([k, v]) => { if (v) fd.append(k, String(v)); });
        this.auth.updateMyProfile(fd).subscribe({
          next: () => { this.toast.success('Profil mis à jour !'); this.loading = false; },
          error: () => { this.loading = false; }
        });
      },
      error: (e) => { this.toast.error(e.error?.email?.[0] || 'Erreur.'); this.loading = false; }
    });
  }

  changePassword() {
    if (this.pwdForm.invalid) { this.pwdForm.markAllAsTouched(); return; }
    this.pwdLoading = true;
    this.auth.changePassword(this.pwdForm.value).subscribe({
      next: () => { this.toast.success('Mot de passe modifié !'); this.pwdForm.reset(); this.pwdLoading = false; },
      error: (e) => { this.toast.error(e.error?.old_password?.[0] || 'Erreur.'); this.pwdLoading = false; }
    });
  }

  f(form: FormGroup, n: string) { return form.get(n); }
}
