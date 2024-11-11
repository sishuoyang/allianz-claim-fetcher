// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component'; // Root component for routing
import { LoginComponent } from './app/login/login.component';
import { ClaimListComponent } from './app/claim-list/claim-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'claims', component: ClaimListComponent }
];

bootstrapApplication(AppComponent, {  // Bootstrap AppComponent, not LoginComponent
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});
