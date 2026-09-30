import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService } from '../services/client.service';
import { ACTIVITY_LABELS, Activity, Client } from '../models/client.model';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe],
  template: `
    @if (error) { <div class="alert error">{{ error }}</div> }

    @if (client) {
      <div class="page-head">
        <h1>{{ client.name }}</h1>
        <div>
          <a class="btn" routerLink="/clients">Back</a>
          <a class="btn" style="margin-left:6px" [routerLink]="['/clients', client._id, 'edit']">Edit</a>
          <button class="btn danger" style="margin-left:6px" (click)="remove()">Delete</button>
        </div>
      </div>

      <div class="card">
        <h2>Client information</h2>
        <dl class="details">
          <dt>Contact person</dt><dd>{{ client.contactPerson }}</dd>
          <dt>Email</dt><dd>{{ client.email }}</dd>
          <dt>Phone</dt><dd>{{ client.phone }}</dd>
          <dt>Address</dt><dd>{{ client.address || '-' }}</dd>
          <dt>Status</dt>
          <dd><span class="badge" [class.active]="client.status === 'Active'" [class.inactive]="client.status === 'Inactive'">{{ client.status }}</span></dd>
          <dt>Created</dt><dd>{{ client.createdAt | date: 'medium' }}</dd>
          <dt>Last updated</dt><dd>{{ client.updatedAt | date: 'medium' }}</dd>
          <dt>Notes</dt><dd class="pre">{{ client.notes || '-' }}</dd>
        </dl>
      </div>

      <div class="card">
        <h2>Activity history</h2>
        <div class="note-form">
          <textarea placeholder="Add a note..." [(ngModel)]="noteText" rows="2"></textarea>
          <button class="btn primary" (click)="addNote()" [disabled]="!noteText.trim() || savingNote">Add note</button>
        </div>
        @if (noteError) { <div class="alert error">{{ noteError }}</div> }

        @if (activities.length === 0) {
          <div class="empty">No activity yet.</div>
        } @else {
          <ul class="timeline">
            @for (a of activities; track a._id) {
              <li>
                <div class="type">{{ labels[a.type] }}</div>
                @if (a.type === 'note_added') { <div class="pre">{{ a.message }}</div> }
                @else { <div>{{ a.message }}</div> }
                <div class="time">{{ a.createdAt | date: 'medium' }}</div>
              </li>
            }
          </ul>
        }
      </div>
    }
  `,
})
export class ClientDetailComponent implements OnInit {
  private api = inject(ClientService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id = this.route.snapshot.paramMap.get('id') as string;
  client: Client | null = null;
  activities: Activity[] = [];
  labels = ACTIVITY_LABELS;
  noteText = '';
  savingNote = false;
  noteError = '';
  error = '';

  ngOnInit(): void {
    this.api.get(this.id).subscribe({
      next: (c) => { this.client = c; this.loadActivities(); },
      error: (e) => { this.error = e?.error?.message || 'Could not load client'; },
    });
  }

  loadActivities(): void {
    this.api.activities(this.id).subscribe({
      next: (a) => (this.activities = a),
      error: () => (this.error = 'Could not load activity history'),
    });
  }

  addNote(): void {
    this.savingNote = true;
    this.noteError = '';
    this.api.addNote(this.id, this.noteText.trim()).subscribe({
      next: () => { this.noteText = ''; this.savingNote = false; this.loadActivities(); },
      error: (e) => { this.noteError = e?.error?.errors?.text || e?.error?.message || 'Could not add note'; this.savingNote = false; },
    });
  }

  remove(): void {
    if (!this.client || !confirm('Delete "' + this.client.name + '"? This also removes its activity history.')) return;
    this.api.remove(this.id).subscribe({
      next: () => this.router.navigate(['/clients']),
      error: (e) => { this.error = e?.error?.message || 'Delete failed'; },
    });
  }
}
