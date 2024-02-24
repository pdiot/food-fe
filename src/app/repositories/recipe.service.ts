import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { BASE_API_URL } from "../conf/basic.conf";
import { RecipeModel, RecipeModelPost } from "../models/recipe.model";

@Injectable()
export class RecipeRepositoryService {
    private baseUrl = `${BASE_API_URL}/recipes`;

    private http: HttpClient = inject(HttpClient);

    getAllRecipes(): Observable<RecipeModel[]> {
        return this.http.get<RecipeModel[]>(this.baseUrl);
    }

    getRecipeById(id: string): Observable<RecipeModel> {
        return this.http.get<RecipeModel>(`${this.baseUrl}/${id}`);
    }

    createRecipe(recipe: Partial<RecipeModelPost>): Observable<RecipeModel> {
        return this.http.post<RecipeModel>(this.baseUrl, recipe);
    }

    patchRecipe(id: string, recipe: Partial<RecipeModelPost>): Observable<RecipeModel> {
        return this.http.patch<RecipeModel>(`${this.baseUrl}/${id}`, recipe);
    }

    deleteRecipe(id: string): Observable<RecipeModel> {
        return this.http.delete<RecipeModel>(`${this.baseUrl}/${id}`);
    }
}