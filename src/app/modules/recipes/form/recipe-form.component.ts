import { Component, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RecipeRepositoryService } from "../../../repositories/recipe.service";
import { RecipeFormSchema, RecipeModel } from "../../../models/recipe.model";
import { FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { SharedModule } from "../../shared/shared.module";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";

@Component({
    standalone: true,
    imports: [SharedModule],
    providers: [RecipeRepositoryService],
    selector: "app-recipe-form",
    templateUrl: "./recipe-form.component.html",
})
export class RecipeFormComponent {

    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);
    private recipeId = this.activatedRoute.snapshot.params['id'] as string | undefined;

    private recipeRepositoryService = inject(RecipeRepositoryService);
    titleIcon = faBookOpen;

    recipe?: RecipeModel;

    formGroup?: FormGroup<RecipeFormSchema>;

    constructor() {
        if (this.recipeId) {
            this.recipeRepositoryService.getRecipeById(this.recipeId).subscribe({
                next: (recipe) => {
                    this.recipe = recipe;
                    this.createForm();
                },
                error: (error) => {
                    console.error(error);
                }
            });
        } else {
            this.createForm();
        }
    }

    createForm() {
        this.formGroup = new FormGroup<RecipeFormSchema>(new RecipeFormSchema(this.recipe));
    }

    backToRecipes(): void {
        this.router.navigate(["/recipes"]);
    }

    saveRecipe(): void {
        if (this.formGroup) {
            let backEndRequest$: Observable<RecipeModel>;
            if (this.recipe) {
                backEndRequest$ = this.recipeRepositoryService.patchRecipe(this.recipe._id, this.formGroup.value);
            } else {
                backEndRequest$ = this.recipeRepositoryService.createRecipe(this.formGroup.value);
            }

            backEndRequest$.subscribe({
                next: (recipe) => {
                    this.recipe = recipe;
                    this.backToRecipes();
                },
                error: (error) => {
                    console.error(error);
                }
            });

        }
    }

}