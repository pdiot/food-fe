import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { BASE_API_URL } from "../conf/basic.conf";
import { RecipeModel, RecipeModelPost } from "../models/recipe.model";
import { BackUrlState } from "../utils/back-url.conf";

@Injectable()
export class RecipeRepositoryService {
    // private baseUrl = `${BASE_API_URL}/recipes`;
    private urlState = inject(BackUrlState);
    private baseUrl() { return `${this.urlState.getBackUrl()}/recipes`; }

    private http: HttpClient = inject(HttpClient);

    getAllRecipes(search?: string): Observable<RecipeModel[]> {
        return this.http.get<RecipeModel[]>(`${this.baseUrl()}/search`, {
            params: {
                searchTerm: search ?? ""
            }
        });
    }

    getRecipeById(id: string): Observable<RecipeModel> {
        return this.http.get<RecipeModel>(`${this.baseUrl()}/${id}`);
    }

    createRecipe(recipe: Partial<RecipeModelPost>): Observable<RecipeModel> {
        return this.http.post<RecipeModel>(this.baseUrl(), recipe);
    }

    patchRecipe(id: string, recipe: Partial<RecipeModelPost>): Observable<RecipeModel> {
        return this.http.patch<RecipeModel>(`${this.baseUrl()}/${id}`, recipe);
    }

    deleteRecipe(id: string): Observable<RecipeModel> {
        return this.http.delete<RecipeModel>(`${this.baseUrl()}/${id}`);
    }
}