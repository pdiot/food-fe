import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { TagsComponent } from './modules/tags/tags.component';
import { IngredientsComponent } from './modules/ingredients/ingredients.component';
import { RecipesComponent } from './modules/recipes/recipes.component';
import { RecipeFormComponent } from './modules/recipes/form/recipe-form.component';

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
    }, {
        path: 'recipes',
        component: RecipesComponent
    }, {
        path: 'recipes/edit/:id',
        component: RecipeFormComponent
    }, {
        path: 'recipes/edit',
        component: RecipeFormComponent
    }
];
