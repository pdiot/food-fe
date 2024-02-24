import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { DbModel } from "./db.model";
import { IngredientModel } from "./ingredient.model";
import { TagModel } from "./tag.model";
import { startWith } from "rxjs";

export interface RecipeModel extends DbModel {
    label: string;
    description: string;
    servings: number;
    ingredients: IngredientRecipeAssociation[];
    tags: TagModel[];
}

export interface IngredientRecipeAssociation {
    ingredient: IngredientModel;
    quantity: number;
}

export interface RecipeModelPost {
    _id: string;
    label: string;
    description?: string;
    servings: number;
    ingredientIdsAssos: IngredientRecipeAssociationPost[];
    tagIds: string[];
}

export interface IngredientRecipeAssociationPost {
    ingredientId: string;
    quantity: number;
}

export class RecipeFormSchema {

    label: FormControl<string | undefined>;
    description: FormControl<string | undefined>;
    servings: FormControl<number | undefined>;
    ingredients: FormArray<FormGroup<IngredientRecipeAssociationFormSchema | undefined>>;
    tags: FormControl<TagModel[] | undefined>;

    constructor(recipe?: RecipeModel) {
        this.label = new FormControl<string | undefined>(recipe?.label ?? undefined, { nonNullable: true });
        this.description = new FormControl<string | undefined>(recipe?.description ?? undefined, { nonNullable: true });
        this.servings = new FormControl<number | undefined>(recipe?.servings ?? undefined, { nonNullable: true });
        this.ingredients = new FormArray<FormGroup<IngredientRecipeAssociationFormSchema | undefined>>([]);
        this.tags = new FormControl<TagModel[] | undefined>(recipe?.tags ?? [], { nonNullable: true });

        if (recipe?.ingredients) {
            recipe.ingredients.forEach(ingredient => {
                this.ingredients.push(new FormGroup<IngredientRecipeAssociationFormSchema | undefined>(new IngredientRecipeAssociationFormSchema(ingredient)));
            });
        }

        this.ingredients.valueChanges.pipe(startWith(this.ingredients.value)).subscribe((value) => {
            if (value.length === 0) {
                this.ingredients.push(new FormGroup<IngredientRecipeAssociationFormSchema | undefined>(new IngredientRecipeAssociationFormSchema()));
            } else if (value.filter((ingAsso) => (ingAsso?.ingredient === undefined || ingAsso?.ingredient === null) || (ingAsso?.quantity === undefined || ingAsso?.quantity === null)).length === 0) {
                this.ingredients.push(new FormGroup<IngredientRecipeAssociationFormSchema | undefined>(new IngredientRecipeAssociationFormSchema()));
            }
        });

        this.ingredients.updateValueAndValidity();
    }
}

export class IngredientRecipeAssociationFormSchema {

    ingredient: FormControl<IngredientModel | undefined>;
    quantity: FormControl<number | undefined>;

    constructor(association?: IngredientRecipeAssociation) {
        this.ingredient = new FormControl<IngredientModel | undefined>(association?.ingredient ?? undefined, { nonNullable: true });
        this.quantity = new FormControl<number | undefined>(association?.quantity ?? undefined, { nonNullable: true });
    }
}