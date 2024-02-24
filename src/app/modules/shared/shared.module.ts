import { NgModule } from "@angular/core";
import { PipComponent } from "./components/pip/pip.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { MultiselectComponent } from "./components/multiselect/multiselect.component";

@NgModule({
    imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule, FormsModule],
    declarations: [PipComponent, MultiselectComponent],
    exports: [PipComponent, MultiselectComponent, FontAwesomeModule, CommonModule, ReactiveFormsModule, FormsModule]
})
export class SharedModule { }