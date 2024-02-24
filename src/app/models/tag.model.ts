import { FormControl } from "@angular/forms";
import { DbModel } from "./db.model";
import { generateRandomHexaColor } from "../utils/color.utils";

export interface TagModel extends DbModel {
    label: string;
    color: string;
}

export interface TagModelPost {
    label: string;
    color: string;
}

export class TagFormSchema {
    label: FormControl<string | undefined>;
    color: FormControl<string | undefined>;

    constructor(tag?: TagModel) {
        this.label = new FormControl<string | undefined>(tag?.label ?? undefined, { nonNullable: true });
        this.color = new FormControl<string | undefined>(tag?.color ?? generateRandomHexaColor(), { nonNullable: true });
    }
}