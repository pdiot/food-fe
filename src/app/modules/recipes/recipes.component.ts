import { Component, inject } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { RecipeRepositoryService } from "../../repositories/recipe.service";
import { BehaviorSubject, Observable, debounceTime, startWith, switchMap } from "rxjs";
import { TagModel } from "../../models/tag.model";
import { RecipeModel } from "../../models/recipe.model";
import { faKitchenSet, faPlusCircle, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { DecimalPipe } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { memo } from "../../utils/memo.function";
import { FormControl } from "@angular/forms";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { getCaloriesForRecipe, getPricesForRecipe } from "../../utils/recipe.utils";

@UntilDestroy()
@Component({
    standalone: true,
    imports: [SharedModule],
    providers: [RecipeRepositoryService],
    selector: "app-recipes",
    templateUrl: "./recipes.component.html",
})
export class RecipesComponent {

    getPrice = memo((recipe: RecipeModel): number => {
        return getPricesForRecipe(recipe);
    });

    getCalories = memo((recipe: RecipeModel): number => {
        return getCaloriesForRecipe(recipe);
    });

    recipesIcon = faKitchenSet;
    plusIcon = faPlusCircle;
    trashIcon = faTrash;
    searchIcon = faSearch;


    private recipeRepositoryService = inject(RecipeRepositoryService);
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);

    refreshRecipesSubject = new BehaviorSubject<string | undefined>(undefined);
    recipeSearchFormControl = new FormControl<string | undefined>(undefined, { nonNullable: true });
    recipes$?: Observable<RecipeModel[]> = this.refreshRecipesSubject.asObservable().pipe(switchMap(() => this.recipeRepositoryService.getAllRecipes(this.recipeSearchFormControl.value)));

    constructor() {
        this.recipeSearchFormControl.valueChanges.pipe(untilDestroyed(this), debounceTime(500), startWith(this.recipeSearchFormControl.value)).subscribe((value) => {
            this.refreshRecipesSubject.next(value);
        });
    }

    addNewRecipe(): void {
        this.router.navigate(['edit'], { relativeTo: this.activatedRoute });
    }

    editRecipe(recipe: RecipeModel): void {
        this.router.navigate(['edit', recipe._id], { relativeTo: this.activatedRoute });
    }

    loadRecipes(): void {
        this.refreshRecipesSubject.next(this.refreshRecipesSubject.value);
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