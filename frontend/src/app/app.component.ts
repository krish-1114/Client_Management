import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <div class="container bar">
        <a class="brand" routerLink="/">Spreadme <span>Clients</span></a>
        <nav>
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>
          <a routerLink="/clients" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: false }">Clients</a>
        </nav>
      </div>
    </header>
    <main class="container main"><router-outlet /></main>
  `,
})
export class AppComponent {}
