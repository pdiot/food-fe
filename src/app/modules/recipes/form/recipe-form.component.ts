import { Component, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RecipeRepositoryService } from "../../../repositories/recipe.service";
import { RecipeFormSchema, RecipeModel } from "../../../models/recipe.model";
import { FormGroup } from "@angular/forms";
import { Observable, filter } from "rxjs";
import { SharedModule } from "../../shared/shared.module";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { TagRepositoryService } from "../../../repositories/tag.service";
import { IngredientRepositoryService } from "../../../repositories/ingredient.service";
import { DropdownModel } from "../../../utils/form.utils";
import { TagModel } from "../../../models/tag.model";
import { IDropdownSettings } from "ng-multiselect-dropdown";

@Component({
    standalone: true,
    imports: [SharedModule],
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
    private ingredientRepositoryService = inject(IngredientRepositoryService);
    titleIcon = faBookOpen;

    tags: Partial<TagModel>[] = [];
    tagDropdownSettings: IDropdownSettings = {
        singleSelection: false,
        idField: '_id',
        textField: 'label',
        enableCheckAll: false,
        itemsShowLimit: 3,
        allowSearchFilter: true
    }
    ingredientDropdowns: DropdownModel[] = [];

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
        this.loadTagDropdowns();
        this.loadIngredientDropdowns();

        this.watchTagSelection();
        // this.watchIngredientSelection();
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

    loadIngredientDropdowns(): void {
        this.ingredientRepositoryService.getAllIngredients().subscribe({
            next: (ingredients) => {
                this.ingredientDropdowns = [{
                    item_id: 'create_new',
                    item_text: 'Créer un nouvel ingrédient'
                }];
                this.ingredientDropdowns.push(...ingredients.map(ingredient => ({ item_id: ingredient._id, item_text: ingredient.label })));
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    watchTagSelection(): void {
        if (this.formGroup) {
            this.formGroup.controls.tags.valueChanges.subscribe((tags) => {
                if (!tags) return;
                const createNewIndex = (tags as TagModel[]).findIndex(tag => tag._id === 'create_new');
                if (createNewIndex !== -1) {
                    // Create new
                    this.formGroup?.controls.tags.setValue((tags as TagModel[]).filter((tag, index) => index !== createNewIndex));
                }
            });
        }
    }

    watchIngredientSelection(): void {
        // if (this.formGroup) {
        //     this.formGroup.controls.ingredients.valueChanges.subscribe((ingredients) => {
        //         if (!ingredients) return;
        //         const createNewIndex = ingredients.findIndex(ingAsso => ingAsso === 'create_new');
        //         if (createNewIndex !== -1) {
        //             // Create new
        //             this.formGroup?.controls.ingredients.setValue((ingredients as { ingredient: DropdownModel }[]).filter((ingAsso, index) => index !== createNewIndex));
        //         }
        //     });
        // }
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


    forceType(obj: string): string {
        return obj;
    }
}