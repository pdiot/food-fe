import { Component, inject } from "@angular/core";
import { TagRepositoryService } from "../../repositories/tag.service";
import { TagFormSchema, TagModel } from "../../models/tag.model";
import { BehaviorSubject, Observable, switchMap } from "rxjs";
import { SharedModule } from "../shared/shared.module";
import { faCircleXmark, faTags } from "@fortawesome/free-solid-svg-icons";
import { FormGroup } from "@angular/forms";
import { generateRandomHexaColor } from "../../utils/color.utils";
import { TagFormComponent } from "./form/tag-form.component";

@Component({
    standalone: true,
    selector: "app-tags",
    providers: [TagRepositoryService],
    imports: [SharedModule, TagFormComponent],
    templateUrl: "./tags.component.html",
})
export class TagsComponent {
    private tagsRepository: TagRepositoryService = inject(TagRepositoryService);

    refreshTagsSubject = new BehaviorSubject<undefined>(undefined);
    tags$?: Observable<TagModel[]> = this.refreshTagsSubject.asObservable().pipe(switchMap(() => this.tagsRepository.getAllTags()));

    currentEditTag?: TagModel;
    xMarkIcon = faCircleXmark;
    tagsIcon = faTags;

    constructor() {
        this.loadTags();
    }

    loadTags(): void {
        this.refreshTagsSubject.next(undefined);
    }

    deleteTag(tag: TagModel): void {
        this.tagsRepository.deleteTag(tag._id).subscribe({
            next: () => {
                this.loadTags();
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    setupFormForEdit(tag: TagModel): void {
        this.currentEditTag = tag;
    }
}