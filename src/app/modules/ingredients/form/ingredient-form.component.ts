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
    @Output() canceled = new EventEmitter<void>();

    @Input() ingredient?: IngredientModel;

    formGroup = new FormGroup<IngredientFormSchema>(new IngredientFormSchema());
    private ingredientsRepository: IngredientRepositoryService = inject(IngredientRepositoryService);

    ngOnChanges(changes: NgChanges<IngredientFormComponent>): void {
        if (changes.ingredient?.currentValue) {
            this.formGroup.reset(changes.ingredient.currentValue);
        }
    }

    cancel(): void {
        this.canceled.emit();
        this.resetForm();
    }

    resetForm(): void {
        this.formGroup.reset();
        this.ingredient = undefined;
    }

    saveIngredient(): void {
        const repositoryCall$ = this.ingredient ? this.ingredientsRepository.patchIngredient(this.ingredient._id, this.formGroup.value) :
            this.ingredientsRepository.createIngredient(this.formGroup.value)

        repositoryCall$.subscribe({
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