import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Serving } from "../planner.model";
import { SharedModule } from "../../shared/shared.module";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export interface PlannerDayData {
    dayLabel: string;
    noonServings: Serving[];
    eveningServings: Serving[];
}

@Component({
    standalone: true,
    imports: [SharedModule],
    selector: 'app-planner-day',
    templateUrl: './planner-day.component.html',
    styleUrls: ['./planner-day.component.scss']
})
export class PlannerDayComponent {
    @Input() data!: PlannerDayData;

    getCalories(): number | undefined {
        return this.data.noonServings.concat(this.data.eveningServings).reduce((acc, serving) => acc + (serving.calories ?? 0), 0);
    }

    removeServing(servings: Serving[], index: number): void {
        servings.splice(index, 1);
    }

    xIcon = faXmark;

}