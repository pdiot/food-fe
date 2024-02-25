import { Injectable } from "@angular/core";
import { FormControl } from "@angular/forms";
import { startWith } from "rxjs";

@Injectable()
export class BackUrlState {
    private backUrl = 'http://localhost:3000';

    formControl: FormControl<string | undefined> = new FormControl<string | undefined>(this.backUrl, { nonNullable: true });

    constructor() {
        this.formControl.valueChanges.pipe(startWith(this.backUrl)).subscribe((value) => {
            if (value) {
                this.backUrl = `${value}/api`;
            }
        });
    }

    getBackUrl(): string {
        return this.backUrl;
    }

    setBackUrl(url: string): void {
        this.backUrl = url;
    }
}