import { Injectable, inject } from "@angular/core";
import { BackUrlState } from "../utils/back-url.conf";
import { HttpClient } from "@angular/common/http";
import { PlannerDayData } from "../modules/planner/planner.component";
import { Observable } from "rxjs";

@Injectable()
export class PlannerRepositoryService {

    private urlState = inject(BackUrlState);

    private baseUrl() { return `${this.urlState.getBackUrl()}/planner`; }

    private http: HttpClient = inject(HttpClient);

    printPlanner(dayPlanners: PlannerDayData[]): Observable<string> {
        return this.http.post<string>(`${this.baseUrl()}/print`, dayPlanners);
    }
}