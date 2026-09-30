import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { ClientService } from '../services/client.service';
import { Client } from '../models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe],
  template: `
    <div class="page-head">
      <h1>Clients</h1>
      <a class="btn primary" routerLink="/clients/new">+ Add client</a>
    </div>

    <div class="card filters">
      <input type="search" placeholder="Search by name, contact person, email or phone" [ngModel]="search" (ngModelChange)="onSearch($event)">
      <select [ngModel]="status" (ngModelChange)="onStatus($event)">
        <option value="">All statuses</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>

    @if (error) { <div class="alert error">{{ error }}</div> }

    <div class="card">
      @if (loading) {
        <p class="muted">Loading...</p>
      } @else if (clients.length === 0) {
        <div class="empty">No clients found.</div>
      } @else {
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Contact person</th><th>Email</th><th>Phone</th><th>Status</th><th>Added</th><th></th></tr>
            </thead>
            <tbody>
              @for (c of clients; track c._id) {
                <tr>
                  <td><a [routerLink]="['/clients', c._id]">{{ c.name }}</a></td>
                  <td>{{ c.contactPerson }}</td>
                  <td>{{ c.email }}</td>
                  <td>{{ c.phone }}</td>
                  <td><span class="badge" [class.active]="c.status === 'Active'" [class.inactive]="c.status === 'Inactive'">{{ c.status }}</span></td>
                  <td>{{ c.createdAt | date: 'mediumDate' }}</td>
                  <td class="actions">
                    <a class="btn sm" [routerLink]="['/clients', c._id]">View</a>
                    <a class="btn sm" [routerLink]="['/clients', c._id, 'edit']">Edit</a>
                    <button class="btn sm danger" (click)="remove(c)">Delete</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      <div class="pager">
        <span>{{ total }} client{{ total === 1 ? '' : 's' }}</span>
        <div>
          <button class="btn sm" [disabled]="page <= 1" (click)="go(page - 1)">Previous</button>
          <span>Page {{ page }} of {{ totalPages }}</span>
          <button class="btn sm" [disabled]="page >= totalPages" (click)="go(page + 1)">Next</button>
        </div>
      </div>
    </div>
  `,
})
export class ClientListComponent implements OnInit, OnDestroy {
  private api = inject(ClientService);
  clients: Client[] = [];
  search = '';
  status = '';
  page = 1;
  limit = 10;
  total = 0;
  totalPages = 1;
  loading = true;
  error = '';
  private search$ = new Subject<string>();
  private searchSub?: Subscription;
  private reqSub?: Subscription;

  ngOnInit(): void {
    this.searchSub = this.search$.pipe(debounceTime(300), distinctUntilChanged()).subscribe((v) => {
      this.search = v;
      this.page = 1;
      this.load();
    });
    this.load();
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
    this.reqSub?.unsubscribe();
  }

  onSearch(v: string): void { this.search$.next(v); }

  onStatus(v: string): void {
    this.status = v;
    this.page = 1;
    this.load();
  }

  go(p: number): void {
    this.page = p;
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.reqSub?.unsubscribe();
    this.reqSub = this.api.list({ search: this.search, status: this.status, page: this.page, limit: this.limit }).subscribe({
      next: (r) => {
        this.clients = r.data;
        this.total = r.total;
        this.totalPages = r.totalPages;
        this.page = r.page;
        this.loading = false;
      },
      error: (e) => { this.error = e?.error?.message || 'Could not load clients. Is the API running?'; this.loading = false; },
    });
  }

  remove(c: Client): void {
    if (!confirm('Delete "' + c.name + '"? This also removes its activity history.')) return;
    this.api.remove(c._id).subscribe({
      next: () => {
        if (this.clients.length === 1 && this.page > 1) this.page--;
        this.load();
      },
      error: (e) => { this.error = e?.error?.message || 'Delete failed'; },
    });
  }
}
