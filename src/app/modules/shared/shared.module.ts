import { NgModule } from "@angular/core";
import { PipComponent } from "./components/pip/pip.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MultiselectComponent } from "./components/multiselect/multiselect.component";
import { ModalComponent } from "./components/modal/modal.component";

@NgModule({
    imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule, FormsModule],
    declarations: [PipComponent, MultiselectComponent, ModalComponent],
    exports: [PipComponent, MultiselectComponent, FontAwesomeModule, CommonModule, ReactiveFormsModule, FormsModule, ModalComponent]
})
export class SharedModule { }