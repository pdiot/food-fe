import { Component, inject } from "@angular/core";
import { TagRepositoryService } from "../../repositories/tag.service";
import { TagFormSchema, TagModel } from "../../models/tag.model";
import { BehaviorSubject, Observable, switchMap } from "rxjs";
import { SharedModule } from "../shared/shared.module";
import { faCircleXmark, faTags } from "@fortawesome/free-solid-svg-icons";
import { FormGroup } from "@angular/forms";
import { generateRandomHexaColor } from "../../utils/color.utils";

@Component({
    standalone: true,
    selector: "app-tags",
    providers: [TagRepositoryService],
    imports: [SharedModule],
    templateUrl: "./tags.component.html",
})
export class TagsComponent {
    private tagsRepository: TagRepositoryService = inject(TagRepositoryService);

    formGroup = new FormGroup<TagFormSchema>(new TagFormSchema());

    refreshTagsSubject = new BehaviorSubject<undefined>(undefined);
    tags$?: Observable<TagModel[]> = this.refreshTagsSubject.asObservable().pipe(switchMap(() => this.tagsRepository.getAllTags()));

    xMarkIcon = faCircleXmark;
    tagsIcon = faTags;

    constructor() {
        this.loadTags();
    }

    loadTags(): void {
        this.refreshTagsSubject.next(undefined);
    }

    resetForm(): void {
        this.formGroup.reset({
            color: generateRandomHexaColor()
        });
    }

    saveTag(): void {
        this.tagsRepository.createTag(this.formGroup.value).subscribe({
            next: () => {
                this.resetForm();
                this.loadTags();
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    deleteTag(tag: TagModel): void {
        this.tagsRepository.deleteTag(tag._id).subscribe({
            next: () => {
                console.log('next deleted')
                this.loadTags();
            },
            error: (error) => {
                console.error(error);
            }
        });
    }
}