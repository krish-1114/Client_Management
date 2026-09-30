import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity, Client, ClientInput, DashboardStats, Paged } from '../models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private http = inject(HttpClient);
  private base = '/api';

  list(opts: { search: string; status: string; page: number; limit: number }): Observable<Paged<Client>> {
    let params = new HttpParams().set('page', opts.page).set('limit', opts.limit);
    if (opts.search) params = params.set('search', opts.search);
    if (opts.status) params = params.set('status', opts.status);
    return this.http.get<Paged<Client>>(this.base + '/clients', { params });
  }

  get(id: string): Observable<Client> {
    return this.http.get<Client>(this.base + '/clients/' + id);
  }

  create(body: ClientInput): Observable<Client> {
    return this.http.post<Client>(this.base + '/clients', body);
  }

  update(id: string, body: ClientInput): Observable<Client> {
    return this.http.put<Client>(this.base + '/clients/' + id, body);
  }

  remove(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(this.base + '/clients/' + id);
  }

  activities(id: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.base + '/clients/' + id + '/activities');
  }

  addNote(id: string, text: string): Observable<Activity> {
    return this.http.post<Activity>(this.base + '/clients/' + id + '/notes', { text });
  }

  stats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(this.base + '/dashboard');
  }
}
