import { Output, EventEmitter, Component, inject, Input, OnChanges, SimpleChanges } from "@angular/core";
import { TagFormSchema, TagModel } from "../../../models/tag.model";
import { FormGroup } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";
import { generateRandomHexaColor } from "../../../utils/color.utils";
import { TagRepositoryService } from "../../../repositories/tag.service";
import { NgChanges } from "../../../utils/typed-on-changes.util";

@Component({
    standalone: true,
    selector: "app-tag-form",
    imports: [SharedModule],
    templateUrl: "./tag-form.component.html",
})
export class TagFormComponent implements OnChanges {
    @Output() saved = new EventEmitter<TagModel>();

    @Input() tag?: TagModel;

    formGroup = new FormGroup<TagFormSchema>(new TagFormSchema());
    private tagsRepository: TagRepositoryService = inject(TagRepositoryService);

    ngOnChanges(changes: NgChanges<TagFormComponent>): void {
        if (changes.tag?.currentValue) {
            this.formGroup.reset(changes.tag.currentValue);
        }
    }

    resetForm(): void {
        this.formGroup.reset({
            color: generateRandomHexaColor()
        });
    }

    saveTag(): void {
        this.tagsRepository.createTag(this.formGroup.value).subscribe({
            next: (newTag) => {
                this.resetForm();
                this.saved.emit(newTag);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }
}