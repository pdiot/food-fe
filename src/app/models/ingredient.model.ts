import { FormControl } from "@angular/forms";
import { DbModel } from "./db.model";

export interface IngredientModel extends DbModel {
    label: string;
    unit: string;
    price?: number;
    calories?: number;
}

export interface IngredientModelPost {
    label: string;
    unit: string;
    price?: number;
    calories?: number;
}

export class IngredientFormSchema {
    label: FormControl<string | undefined>;
    unit: FormControl<string | undefined>;
    price: FormControl<number | undefined>;
    calories: FormControl<number | undefined>;

    constructor(ingredient?: IngredientModel) {
        this.label = new FormControl<string | undefined>(ingredient?.label ?? undefined, { nonNullable: true });
        this.unit = new FormControl<string | undefined>(ingredient?.unit ?? undefined, { nonNullable: true });
        this.price = new FormControl<number | undefined>(ingredient?.price ?? undefined, { nonNullable: true });
        this.calories = new FormControl<number | undefined>(ingredient?.calories ?? undefined, { nonNullable: true });
    }
}