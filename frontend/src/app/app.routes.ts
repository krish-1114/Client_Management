import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard.component';
import { ClientListComponent } from './pages/client-list.component';
import { ClientFormComponent } from './pages/client-form.component';
import { ClientDetailComponent } from './pages/client-detail.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'clients', component: ClientListComponent },
  { path: 'clients/new', component: ClientFormComponent },
  { path: 'clients/:id/edit', component: ClientFormComponent },
  { path: 'clients/:id', component: ClientDetailComponent },
  { path: '**', redirectTo: '' },
];
