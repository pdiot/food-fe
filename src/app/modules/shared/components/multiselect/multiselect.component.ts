import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { faChevronDown, faChevronUp, faCircleXmark, faXmark } from "@fortawesome/free-solid-svg-icons";
import { memo } from "../../../../utils/memo.function";

@Component({
    selector: "app-multiselect",
    // templateUrl: "./multiselect.component.html",
    styleUrls: ["./multiselect.component.scss"],
    template: `
    <div class="flex align-items-center justify-content-left multiselect-input gap-1" id="{{inputId}}">
        @if ((multiselectFormControl.value === undefined || multiselectFormControl.value === null ||
                multiselectFormControl.value.length === 0) && placeholder)
        {
            <div class="placeholder"> {{placeholder}}</div>
        } @else {
            @for (item of multiselectFormControl.value; track $index) {
                @if ($index < 3) {
                    <div class="multiselect-item" style="{{item.color ? 'background-color: ' + item.color : ''}}">
                        <span> {{item[optionLabel ?? 'label']}} </span>
                        
                        <fa-icon [icon]="xIcon" (click)="removeItem(optionValue ? item[optionValue] : item)" class="clickable"></fa-icon>
                    </div>
                }                
            }
            @if (multiselectFormControl.value && multiselectFormControl.value.length > 3) {
                <div class="multiselect-item">
                    <span>+{{multiselectFormControl.value.length - 3}} ... </span>
                </div>
            }
            <div class="flex w-full"></div>
            <div class="flex justify-content-right">
                <div class="chevron">
                    @if (expanded) {
                        <fa-icon [icon]="chevronUp" class="clickable" (click)="expanded = false"></fa-icon>
                    } @else {
                        <fa-icon [icon]="chevronDown" class="clickable" (click)="expanded = true"></fa-icon>
                    }
                </div>
            </div>
        }
    </div>

    <div class="multiselect-backdrop" *ngIf="expanded" (click)="expanded = false">
    </div>
    <div class="multiselect-overlay" style="maxHeight: {{maxHeight}}; width: {{width}}" *ngIf="expanded">
        <!-- Si je veux ici une searchbar -->
        <div class="flex flex-column multiselect-overlay-panel" style="maxHeight: {{maxHeight}};">
            @if(options && options.length > 0) {
                @for (item of options; track $index) {
                    <div class="flex w-full clickable option-item" (click)="toggleSelection(item)">
                    @if (multiselectFormControl.value) {
                        <input type="checkbox" [checked]="isIncluded(item, multiselectFormControl.value)" class="clickable">
                    }
                        {{ item[optionLabel ?? 'label'] }}
                    </div>
                }
            } @else {
                <div class="flex w-full option-item">
                    No options available
                </div>
            }
        </div>
    </div>
    
`
})
export class MultiselectComponent {
    @Input() multiselectFormControl!: FormControl<any[]> | FormControl<any[] | undefined>;
    @Input() options!: any[];
    @Input() placeholder?: string;
    @Input() inputId?: string;
    @Input() optionLabel?: string;
    @Input() optionValue?: string;
    @Input() maxHeight = '300px';
    @Input() width = '800px';

    @Output() selectedCreateNew = new EventEmitter<void>();

    isIncluded = memo((value: any, array: any[]) => {
        const included = this.findIndex(value, array) !== -1
        return included;
    });

    private findIndex(value: any, array: any[]): number {
        return array.findIndex((i) => this.sortedStringify(this.optionValue ? i[this.optionValue] : i) === this.sortedStringify(value));
    }

    private sortedStringify(value: any): string {
        return JSON.stringify(value, Object.keys(value).sort());
    }

    xIcon = faXmark;
    chevronDown = faChevronDown;
    chevronUp = faChevronUp;

    expanded = false;

    removeItem(item: any): void {
        if (this.multiselectFormControl.value) {
            const index = this.findIndex(item, this.multiselectFormControl.value);
            if (index !== -1) {
                this.multiselectFormControl.setValue(this.multiselectFormControl.value.filter((item, i) => i !== index));
            }
        }
    }

    toggleSelection(item: any): void {
        if (this.optionValue ? item[this.optionValue] === 'create_new' : item._id === 'create_new') {
            this.selectedCreateNew.emit();
            this.expanded = false;
            return;
        }
        if (this.multiselectFormControl.value) {
            const index = this.findIndex(item, this.multiselectFormControl.value);
            if (index !== -1) {
                this.multiselectFormControl.setValue(this.multiselectFormControl.value.filter((i, iIndex) => iIndex !== index));
            } else {
                this.multiselectFormControl.setValue([...this.multiselectFormControl.value, item]);
            }
        }
    }
}