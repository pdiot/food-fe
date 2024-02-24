import { NgModule } from "@angular/core";
import { PipComponent } from "./components/pip.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    imports: [FontAwesomeModule, CommonModule, ReactiveFormsModule, FormsModule],
    declarations: [PipComponent],
    exports: [PipComponent, FontAwesomeModule, CommonModule, ReactiveFormsModule, FormsModule]
})
export class SharedModule { }