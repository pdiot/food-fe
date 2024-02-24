import { Component, inject } from "@angular/core";
import { faCircleXmark, faCubesStacked } from "@fortawesome/free-solid-svg-icons";
import { SharedModule } from "../shared/shared.module";
import { IngredientFormComponent } from "./form/ingredient-form.component";
import { IngredientRepositoryService } from "../../repositories/ingredient.service";
import { BehaviorSubject, Observable, switchMap } from "rxjs";
import { TagModel } from "../../models/tag.model";
import { IngredientModel } from "../../models/ingredient.model";

@Component({
    standalone: true,
    selector: "app-ingredients",
    imports: [SharedModule, IngredientFormComponent],
    providers: [IngredientRepositoryService],
    templateUrl: "./ingredients.component.html",
})
export class IngredientsComponent {
    xMarkIcon = faCircleXmark;
    ingredientsIcon = faCubesStacked;

    private ingredientRepository: IngredientRepositoryService = inject(IngredientRepositoryService);
    refreshIngredientsSubject = new BehaviorSubject<undefined>(undefined);
    ingredients$?: Observable<IngredientModel[]> = this.refreshIngredientsSubject.asObservable().pipe(switchMap(() => this.ingredientRepository.getAllIngredients()));

    constructor() {
        this.loadIngredients();
    }

    loadIngredients(): void {
        this.refreshIngredientsSubject.next(undefined);
    }

    deleteIngredient(ingredient: IngredientModel): void {
        this.ingredientRepository.deleteIngredient(ingredient._id).subscribe({
            next: () => {
                this.loadIngredients();
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

}