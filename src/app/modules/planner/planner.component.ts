import { Component, inject } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { faCalendar, faPlus, faPrint, faXmark } from "@fortawesome/free-solid-svg-icons";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { Serving } from "./planner.model";
import { RecipeModel } from "../../models/recipe.model";
import { getCaloriesForRecipe, getPricesForRecipe } from "../../utils/recipe.utils";
import { RecipeRepositoryService } from "../../repositories/recipe.service";
import { memo } from "../../utils/memo.function";

export interface PlannerDayData {
    dayLabel: string;
    noonServings: Serving[];
    eveningServings: Serving[];
}

@Component({
    standalone: true,
    imports: [SharedModule, DragDropModule],
    providers: [RecipeRepositoryService],
    selector: "app-planner",
    templateUrl: "./planner.component.html",
    styleUrls: ["./planner.component.scss"]
})
export class PlannerComponent {
    printIcon = faPrint;
    plannerIcon = faCalendar;
    plusIcon = faPlus;
    xIcon = faXmark;

    private recipeRepositoryService = inject(RecipeRepositoryService);
    recipes: RecipeModel[] = [];

    plannerDayDatas: PlannerDayData[] = [
        {
            dayLabel: "Lundi",
            noonServings: [],
            eveningServings: []
        },
        {
            dayLabel: "Mardi",
            noonServings: [],
            eveningServings: []
        },
        {
            dayLabel: "Mercredi",
            noonServings: [],
            eveningServings: []
        },
        {
            dayLabel: "Jeudi",
            noonServings: [],
            eveningServings: []
        },
        {
            dayLabel: "Vendredi",
            noonServings: [],
            eveningServings: []
        },
        {
            dayLabel: "Samedi",
            noonServings: [],
            eveningServings: []
        },
        {
            dayLabel: "Dimanche",
            noonServings: [],
            eveningServings: []
        }
    ];

    getConnectedServingsForNoon = memo((index: number): string[] => {
        const result: string[] = [];
        for (let i = 0; i < this.plannerDayDatas.length; i++) {
            if (i !== index) {
                result.push('noon-' + i);
            }
            result.push('evening-' + i);
        }
        result.push('availableServings');
        return result;
    });

    getConnectedServingsForEvening = memo((index: number): string[] => {
        const result: string[] = [];
        for (let i = 0; i < this.plannerDayDatas.length; i++) {
            result.push('noon-' + i);
            if (i !== index) {
                result.push('evening-' + i);
            }
        }
        result.push('availableServings');
        return result;
    });

    getConnectedServingsForAvailable = memo((): string[] => {
        const result: string[] = [];
        for (let i = 0; i < this.plannerDayDatas.length; i++) {
            result.push('noon-' + i);
            result.push('evening-' + i);
        }
        return result;
    });

    showRecipeSelectModal = false;

    availableServings: Serving[] = [];

    currentDraggedIndex: number | undefined;
    currentDraggingFrom: Serving[] | undefined;

    printOut(): void {
        // window.print();
    };

    onRecipeSelect(recipe: RecipeModel): void {
        const portions: Serving[] = [];
        for (let i = 1; i <= recipe.servings; i++) {
            portions.push({ recipeId: recipe._id, recipeLabel: recipe.label, calories: getCaloriesForRecipe(recipe), price: getPricesForRecipe(recipe) });
        }
        this.availableServings.push(...portions);
        this.showRecipeSelectModal = false;
    }

    onModaleClose(): void {
        this.showRecipeSelectModal = false;
    }

    removeServingFromAvailableServing(index: number): void {
        this.availableServings.splice(index, 1);
    }

    removeServingFromDayServingList(time: 'evening' | 'noon', index: number): void {
        let deleted: Serving;
        if (time === 'noon') {
            deleted = this.plannerDayDatas[index].noonServings.splice(index, 1)[0];
        }
        else {
            deleted = this.plannerDayDatas[index].eveningServings.splice(index, 1)[0];
        }
        if (deleted) {
            this.availableServings.push(deleted);
        }
    }

    getCalories(data: PlannerDayData): number | undefined {
        return data.noonServings.concat(data.eveningServings).reduce((acc, serving) => acc + (serving.calories ?? 0), 0);
    }

    showRecipeModal(): void {
        this.recipeRepositoryService.getAllRecipes().subscribe((recipes) => {
            this.recipes = recipes;
            this.showRecipeSelectModal = true;
        });
    }

    onDropped(event: any): void {
        let destinationList: Serving[];
        const containerId = event.container.id;
        if (containerId) {
            if (containerId.startsWith("noon")) {
                destinationList = this.plannerDayDatas[parseInt(containerId.split("-")[1])].noonServings;
            } else if (containerId.startsWith("evening")) {
                destinationList = this.plannerDayDatas[parseInt(containerId.split("-")[1])].eveningServings;
            } else if (containerId === "availableServings") {
                destinationList = this.availableServings;
            } else {
                console.error("Unknown container id");
                this.resetDragState();
                return;
            }

            if (this.currentDraggedIndex !== undefined && this.currentDraggingFrom !== undefined) {
                const draggedServing = this.currentDraggingFrom[this.currentDraggedIndex];
                destinationList.push(draggedServing);
                this.currentDraggingFrom.splice(this.currentDraggedIndex, 1);
                this.resetDragState();
            } else {
                console.error("No drag state found");
                this.resetDragState();
            }
        } else {
            console.error("Drag Container id not found");
            this.resetDragState();
        }

        console.log("onDropped", this.plannerDayDatas, this.availableServings);
    }

    onDragStarted(sourceList: Serving[], index: number): void {
        this.currentDraggedIndex = index;
        this.currentDraggingFrom = sourceList;
    }

    resetDragState(): void {
        this.currentDraggedIndex = undefined;
        this.currentDraggingFrom = undefined;
    }
}