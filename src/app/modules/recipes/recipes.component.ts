import { Component, inject } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { RecipeRepositoryService } from "../../repositories/recipe.service";
import { BehaviorSubject, Observable, switchMap } from "rxjs";
import { TagModel } from "../../models/tag.model";
import { RecipeModel } from "../../models/recipe.model";
import { faKitchenSet, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { DecimalPipe } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { memo } from "../../utils/memo.function";

@Component({
    standalone: true,
    imports: [SharedModule],
    providers: [RecipeRepositoryService],
    selector: "app-recipes",
    templateUrl: "./recipes.component.html",
})
export class RecipesComponent {

    getPrice = memo((recipe: RecipeModel): number => {
        return recipe.ingredients.reduce((acc, ingAsso) =>
            acc + (ingAsso.ingredient.price ?? 0) * (ingAsso.quantity ?? 0), 0
        ) / (recipe.servings === 0 ? 1 : recipe.servings);
    });

    getCalories = memo((recipe: RecipeModel): number => {
        return recipe.ingredients.reduce((acc, ingAsso) =>
            acc + (ingAsso.ingredient.calories ?? 0) * (ingAsso.quantity ?? 0), 0
        ) / (recipe.servings === 0 ? 1 : recipe.servings);
    });

    recipesIcon = faKitchenSet;
    plusIcon = faPlusCircle;
    trashIcon = faTrash;


    private recipeRepositoryService = inject(RecipeRepositoryService);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);

    refreshRecipesSubject = new BehaviorSubject<undefined>(undefined);
    recipes$?: Observable<RecipeModel[]> = this.refreshRecipesSubject.asObservable().pipe(switchMap(() => this.recipeRepositoryService.getAllRecipes()));

    constructor() {
        this.loadRecipes();
    }

    addNewRecipe(): void {
        this.router.navigate(['edit'], { relativeTo: this.activatedRoute });
    }

    editRecipe(recipe: RecipeModel): void {
        this.router.navigate(['edit', recipe._id], { relativeTo: this.activatedRoute });
    }

    loadRecipes(): void {
        this.refreshRecipesSubject.next(undefined);
    }

    deleteRecipe(recipe: RecipeModel): void {
        this.recipeRepositoryService.deleteRecipe(recipe._id).subscribe({
            next: () => {
                this.loadRecipes();
            },
            error: (error) => {
                console.error(error);
            }
        });
    }


}