import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Role } from '../../../core/models/auth.models';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading = false;
  error = '';
  roles: Role[] = [];

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private toast: ToastService) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      first_name: [''],
      last_name: [''],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', Validators.required],
      role_id: [null]
    }, { validators: this.passwordMatch });
  }

  ngOnInit() {
    this.auth.getRoles().subscribe({
      next: response => {
        this.roles = response.results;
      }
  });
  console.log("Les roles : ",this.roles)
  }

  passwordMatch(g: AbstractControl) {
    const p = g.get('password')?.value;
    const p2 = g.get('password2')?.value;
    return p === p2 ? null : { mismatch: true };
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    this.auth.register(this.form.value).subscribe({
      next: () => { this.toast.success('Compte créé ! Connectez-vous.'); this.router.navigate(['/auth/login']); },
      error: (e) => {
        const errs = e.error;
        this.error = Object.values(errs).flat().join(' ') || 'Erreur lors de l\'inscription.';
        this.loading = false;
      }
    });
  }

  f(name: string) { return this.form.get(name); }
}
