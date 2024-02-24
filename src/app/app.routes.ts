import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { TagsComponent } from './modules/tags/tags.component';
import { IngredientsComponent } from './modules/ingredients/ingredients.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
    }, {
        path: 'home',
        component: HomeComponent
    }, {
        path: 'tags',
        component: TagsComponent
    }, {
        path: 'ingredients',
        component: IngredientsComponent
    }
];
