import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService } from '../services/client.service';
import { ClientInput } from '../models/client.model';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9][0-9\s\-()]{6,17}$/;

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-head"><h1>{{ id ? 'Edit client' : 'Add client' }}</h1></div>

    @if (error) { <div class="alert error">{{ error }}</div> }

    <form class="card" [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <div class="form-grid">
        <div>
          <label for="name">Client name <span class="req">*</span></label>
          <input id="name" formControlName="name" [class.invalid]="err('name')">
          <div class="field-error">{{ err('name') }}</div>
        </div>
        <div>
          <label for="contactPerson">Contact person <span class="req">*</span></label>
          <input id="contactPerson" formControlName="contactPerson" [class.invalid]="err('contactPerson')">
          <div class="field-error">{{ err('contactPerson') }}</div>
        </div>
        <div>
          <label for="email">Email <span class="req">*</span></label>
          <input id="email" type="email" formControlName="email" [class.invalid]="err('email')">
          <div class="field-error">{{ err('email') }}</div>
        </div>
        <div>
          <label for="phone">Phone <span class="req">*</span></label>
          <input id="phone" formControlName="phone" placeholder="+91 98765 43210" [class.invalid]="err('phone')">
          <div class="field-error">{{ err('phone') }}</div>
        </div>
        <div>
          <label for="status">Status</label>
          <select id="status" formControlName="status">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div class="full">
          <label for="address">Address</label>
          <input id="address" formControlName="address" [class.invalid]="err('address')">
          <div class="field-error">{{ err('address') }}</div>
        </div>
        <div class="full">
          <label for="notes">Notes</label>
          <textarea id="notes" rows="4" formControlName="notes" [class.invalid]="err('notes')"></textarea>
          <div class="field-error">{{ err('notes') }}</div>
        </div>
      </div>
      <div>
        <button class="btn primary" type="submit" [disabled]="saving">{{ saving ? 'Saving...' : id ? 'Save changes' : 'Create client' }}</button>
        <a class="btn" style="margin-left:8px" [routerLink]="id ? ['/clients', id] : ['/clients']">Cancel</a>
      </div>
    </form>
  `,
})
export class ClientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ClientService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: string | null = this.route.snapshot.paramMap.get('id');
  saving = false;
  submitted = false;
  error = '';

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    contactPerson: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.pattern(EMAIL_RE)]],
    phone: ['', [Validators.required, Validators.pattern(PHONE_RE)]],
    address: ['', [Validators.maxLength(300)]],
    status: ['Active' as 'Active' | 'Inactive'],
    notes: ['', [Validators.maxLength(2000)]],
  });

  ngOnInit(): void {
    if (this.id) {
      this.api.get(this.id).subscribe({
        next: (c) => this.form.patchValue(c),
        error: (e) => { this.error = e?.error?.message || 'Could not load client'; },
      });
    }
  }

  err(name: string): string {
    const c = this.form.get(name);
    if (!c || !c.errors || !(c.touched || this.submitted)) return '';
    if (c.errors['server']) return c.errors['server'];
    if (c.errors['required']) return 'This field is required';
    if (c.errors['pattern']) return name === 'email' ? 'Enter a valid email address' : 'Enter a valid phone number (7-15 digits, optional +)';
    if (c.errors['maxlength']) return 'Too long (max ' + c.errors['maxlength'].requiredLength + ' characters)';
    return 'Invalid value';
  }

  submit(): void {
    this.submitted = true;
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const body = this.form.getRawValue() as ClientInput;
    const req = this.id ? this.api.update(this.id, body) : this.api.create(body);
    req.subscribe({
      next: (c) => this.router.navigate(['/clients', c._id]),
      error: (e) => {
        this.saving = false;
        const fields = e?.error?.errors as Record<string, string> | undefined;
        if (fields) {
          for (const key of Object.keys(fields)) {
            this.form.get(key)?.setErrors({ server: fields[key] });
            this.form.get(key)?.markAsTouched();
          }
        } else {
          this.error = e?.error?.message || 'Could not save client. Is the API running?';
        }
      },
    });
  }
}
