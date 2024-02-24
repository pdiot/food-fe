import { Component, importProvidersFrom } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './modules/sidebar/sidebar.component';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'food-fe';
}
