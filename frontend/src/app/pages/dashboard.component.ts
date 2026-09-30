import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClientService } from '../services/client.service';
import { ACTIVITY_LABELS, DashboardStats } from '../models/client.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <div class="page-head">
      <h1>Dashboard</h1>
      <a class="btn primary" routerLink="/clients/new">+ Add client</a>
    </div>

    @if (error) { <div class="alert error">{{ error }}</div> }
    @if (loading) { <p class="muted">Loading...</p> }

    @if (stats) {
      <div class="grid">
        <div class="stat"><div class="label">Total clients</div><div class="value">{{ stats.total }}</div></div>
        <div class="stat"><div class="label">Active</div><div class="value">{{ stats.active }}</div></div>
        <div class="stat"><div class="label">Inactive</div><div class="value">{{ stats.inactive }}</div></div>
      </div>

      <div class="card">
        <h2>Recently added clients</h2>
        @if (stats.recentClients.length === 0) {
          <div class="empty">No clients yet. <a routerLink="/clients/new">Add your first client</a>.</div>
        } @else {
          <div class="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Contact</th><th>Status</th><th>Added</th></tr></thead>
              <tbody>
                @for (c of stats.recentClients; track c._id) {
                  <tr>
                    <td><a [routerLink]="['/clients', c._id]">{{ c.name }}</a></td>
                    <td>{{ c.contactPerson }}</td>
                    <td><span class="badge" [class.active]="c.status === 'Active'" [class.inactive]="c.status === 'Inactive'">{{ c.status }}</span></td>
                    <td>{{ c.createdAt | date: 'mediumDate' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

      @if (stats.recentActivities.length > 0) {
        <div class="card">
          <h2>Recent activity</h2>
          <ul class="timeline">
            @for (a of stats.recentActivities; track a._id) {
              <li>
                <div class="type">{{ labels[a.type] }}</div>
                <div>
                  @if (a.client) { <a [routerLink]="['/clients', a.client._id]">{{ a.client.name }}</a> - }
                  {{ a.message }}
                </div>
                <div class="time">{{ a.createdAt | date: 'medium' }}</div>
              </li>
            }
          </ul>
        </div>
      }
    }
  `,
})
export class DashboardComponent implements OnInit {
  private api = inject(ClientService);
  stats: DashboardStats | null = null;
  loading = true;
  error = '';
  labels = ACTIVITY_LABELS;

  ngOnInit(): void {
    this.api.stats().subscribe({
      next: (s) => { this.stats = s; this.loading = false; },
      error: (e) => { this.error = e?.error?.message || 'Could not load dashboard. Is the API running?'; this.loading = false; },
    });
  }
}
