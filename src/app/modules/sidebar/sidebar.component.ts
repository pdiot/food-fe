import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BackUrlState } from '../../utils/back-url.conf';
import { SharedModule } from '../shared/shared.module';

@Component({
    standalone: true,
    selector: 'app-sidebar',
    imports: [RouterModule, SharedModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

    urlState = inject(BackUrlState);

    // Add your component logic here
    routes: { label: string, route: string }[] = [
        { label: 'Planner', route: '/planner' },
        { label: 'Tags', route: '/tags' },
        { label: 'Ingrédients', route: '/ingredients' },
        { label: 'Recettes', route: '/recipes' }
    ];
}