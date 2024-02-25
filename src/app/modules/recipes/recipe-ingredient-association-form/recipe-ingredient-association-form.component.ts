import { Component, Input, inject } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { IngredientRecipeAssociationFormSchema } from "../../../models/recipe.model";
import { SharedModule } from "../../shared/shared.module";
import { IngredientRepositoryService } from "../../../repositories/ingredient.service";
import { IngredientFormComponent } from "../../ingredients/form/ingredient-form.component";
import { IngredientModel } from "../../../models/ingredient.model";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

@Component({
    standalone: true,
    imports: [SharedModule, IngredientFormComponent],
    providers: [IngredientRepositoryService],
    selector: "app-ria-form",
    templateUrl: "./recipe-ingredient-association-form.component.html"
})
export class RecipeIngredientAssociationFormComponent {
    @Input() formArray!: FormArray<FormGroup<IngredientRecipeAssociationFormSchema | undefined>>;

    private ingredientRepositoryService = inject(IngredientRepositoryService);
    creatingNewIngredient = false;
    creatingNewIngredientForFormIndex?: number;
    ingredients: Partial<IngredientModel>[] = [];

    trashIcon = faTrash;

    constructor() {
        this.loadIngredients();
    }

    loadIngredients(): void {
        this.ingredientRepositoryService.getAllIngredients().subscribe({
            next: (ingredients) => {
                this.ingredients = [{
                    _id: 'create_new',
                    label: 'Créer un nouvel ingrédient'
                }];
                this.ingredients.push(...ingredients);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    removeIngredient(index: number): void {
        this.formArray.removeAt(index);
    }

    onSelectNewIngredient(index: number): void {
        this.creatingNewIngredient = true;
        this.creatingNewIngredientForFormIndex = index;
    }

    onNewIngredientCreated(ingredient: IngredientModel): void {
        if (this.creatingNewIngredientForFormIndex !== undefined) {
            this.formArray.at(this.creatingNewIngredientForFormIndex).patchValue({
                ingredient
            });
        }
        this.loadIngredients();
        this.resetCreateForm();
    }

    onNewIngredientCreationCanceled(): void {
        this.creatingNewIngredient = false;
        this.creatingNewIngredientForFormIndex = undefined;
    }

    resetCreateForm() {
        this.creatingNewIngredient = false;
        this.creatingNewIngredientForFormIndex = undefined;
    }
}