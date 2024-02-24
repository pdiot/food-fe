import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-sidebar',
    imports: [RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    // Add your component logic here
    routes: { label: string, route: string }[] = [
        { label: 'Home', route: '/home' },
        { label: 'Tags', route: '/tags' },
        { label: 'Ingrédients', route: '/ingredients' },
        { label: 'Recettes', route: '/recipes' }
    ];
}