import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

@Component({
    selector: "app-pip",
    templateUrl: "./pip.component.html",
    styleUrls: ["./pip.component.scss"]
})
export class PipComponent {
    @Input() label!: string;
    @Input() icon?: IconProp;
    @Input() color?: string;
    @Output() iconClick = new EventEmitter<void>();
    @Output() labelClick = new EventEmitter<void>();
}