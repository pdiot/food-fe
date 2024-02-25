import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
})
export class ModalComponent {
    @Output() close = new EventEmitter<void>();

}