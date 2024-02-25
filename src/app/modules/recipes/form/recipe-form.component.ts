import { Component, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RecipeRepositoryService } from "../../../repositories/recipe.service";
import { IngredientRecipeAssociation, IngredientRecipeAssociationFormSchema, RecipeFormSchema, RecipeModel, RecipeModelPost } from "../../../models/recipe.model";
import { FormGroup } from "@angular/forms";
import { Observable, filter } from "rxjs";
import { SharedModule } from "../../shared/shared.module";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { TagRepositoryService } from "../../../repositories/tag.service";
import { IngredientRepositoryService } from "../../../repositories/ingredient.service";
import { DropdownModel } from "../../../utils/form.utils";
import { TagModel } from "../../../models/tag.model";
import { TagFormComponent } from "../../tags/form/tag-form.component";
import { RecipeIngredientAssociationFormComponent } from "../recipe-ingredient-association-form/recipe-ingredient-association-form.component";
import { IngredientModel } from "../../../models/ingredient.model";

@Component({
    standalone: true,
    imports: [SharedModule, TagFormComponent, RecipeIngredientAssociationFormComponent],
    providers: [RecipeRepositoryService, TagRepositoryService, IngredientRepositoryService],
    selector: "app-recipe-form",
    templateUrl: "./recipe-form.component.html",
})
export class RecipeFormComponent {

    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);
    private recipeId = this.activatedRoute.snapshot.params['id'] as string | undefined;

    private recipeRepositoryService = inject(RecipeRepositoryService);
    private tagRepositoryService = inject(TagRepositoryService);
    titleIcon = faBookOpen;

    tags: Partial<TagModel>[] = [];

    recipe?: RecipeModel;

    formGroup?: FormGroup<RecipeFormSchema>;

    creatingNewTag = false;

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
        this.loadTagDropdowns();
    }

    loadTagDropdowns(): void {
        this.tagRepositoryService.getAllTags().subscribe({
            next: (tags) => {
                this.tags = [{
                    _id: 'create_new',
                    label: 'Créer un nouveau tag'
                }, ...tags];
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    onNewTagCreated(tag: TagModel): void {
        if (this.formGroup && this.formGroup.controls.tags.value) {
            this.formGroup.controls.tags.setValue([...this.formGroup.controls.tags.value, tag]);
            this.creatingNewTag = false;
            this.loadTagDropdowns();
        }
    }

    onSelectNewTag(): void {
        this.creatingNewTag = true;
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
                backEndRequest$ = this.recipeRepositoryService.patchRecipe(this.recipe._id, this.buildRecipePostData());
            } else {
                backEndRequest$ = this.recipeRepositoryService.createRecipe(this.buildRecipePostData());
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

    buildRecipePostData(): Partial<RecipeModelPost> {
        if (this.formGroup) {
            const recipe: Partial<RecipeModelPost> = {
                label: this.formGroup.controls.label.value,
                description: this.formGroup.controls.description.value,
                servings: this.formGroup.controls.servings.value
            };

            if (this.recipeId) {
                recipe._id = this.recipeId;
            }

            if (this.formGroup.controls.ingredients.value.length !== 0) {
                recipe.ingredientIdsAssos = this.formGroup.controls.ingredients.controls
                    .filter(ingredientFG =>
                        ingredientFG && ingredientFG?.value?.ingredient !== undefined
                        && ingredientFG?.value?.ingredient !== null
                        && ingredientFG?.value?.quantity !== undefined
                        && ingredientFG?.value?.quantity !== null
                    )
                    .map(ingredientFG => {
                        const fg = ingredientFG as FormGroup<IngredientRecipeAssociationFormSchema>;
                        return {
                            ingredientId: (fg.value.ingredient as IngredientModel)._id,
                            quantity: fg.value.quantity as number
                        };
                    });
            }

            if (this.formGroup.controls.tags.value) {
                recipe.tagIds = this.formGroup.controls.tags.value.map((tag: TagModel) => tag._id);
            }

            return recipe;
        }
        return {};
    }


    forceType(obj: string): string {
        return obj;
    }
}