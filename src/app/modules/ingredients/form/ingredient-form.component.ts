import { Component, EventEmitter, Input, OnChanges, Output, inject } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { FormGroup } from "@angular/forms";
import { IngredientModel, IngredientFormSchema } from "../../../models/ingredient.model";
import { IngredientRepositoryService } from "../../../repositories/ingredient.service";
import { NgChanges } from "../../../utils/typed-on-changes.util";

@Component({
    standalone: true,
    selector: 'app-ingredient-form',
    imports: [SharedModule],
    templateUrl: './ingredient-form.component.html'
})
export class IngredientFormComponent implements OnChanges {
    @Output() saved = new EventEmitter<IngredientModel>();

    @Input() ingredient?: IngredientModel;

    formGroup = new FormGroup<IngredientFormSchema>(new IngredientFormSchema());
    private ingredientsRepository: IngredientRepositoryService = inject(IngredientRepositoryService);

    ngOnChanges(changes: NgChanges<IngredientFormComponent>): void {
        if (changes.ingredient?.currentValue) {
            this.formGroup.reset(changes.ingredient.currentValue);
        }
    }

    resetForm(): void {
        this.formGroup.reset();
    }

    saveIngredient(): void {
        this.ingredientsRepository.createIngredient(this.formGroup.value).subscribe({
            next: (newIngredient) => {
                this.resetForm();
                this.saved.emit(newIngredient);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }
}