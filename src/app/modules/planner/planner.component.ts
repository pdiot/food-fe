import { Component, inject } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { faCalendar, faPlus, faPrint, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Serving } from "./planner.model";
import { RecipeModel } from "../../models/recipe.model";
import { getCaloriesForRecipe, getPricesForRecipe } from "../../utils/recipe.utils";
import { RecipeRepositoryService } from "../../repositories/recipe.service";
import { PlannerDayComponent, PlannerDayData } from "./planner-day/planner-day.component";

@Component({
    standalone: true,
    imports: [SharedModule, PlannerDayComponent],
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

    showRecipeSelectModal = false;

    availableServings: Serving[] = [];

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

    removeServing(index: number): void {
        this.availableServings.splice(index, 1);
    }

    showRecipeModal(): void {
        this.recipeRepositoryService.getAllRecipes().subscribe((recipes) => {
            this.recipes = recipes;
            this.showRecipeSelectModal = true;
        });
    }
}