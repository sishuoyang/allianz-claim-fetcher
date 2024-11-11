// app.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  standalone: true,
  template: `<router-outlet></router-outlet>`, // This placeholder enables routing
})
export class AppComponent {}
