import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { BASE_API_URL } from "../conf/basic.conf";
import { IngredientModel, IngredientModelPost } from "../models/ingredient.model";

@Injectable()
export class IngredientRepositoryService {
    private baseUrl = `${BASE_API_URL}/ingredients`;

    private http: HttpClient = inject(HttpClient);

    getAllIngredients(): Observable<IngredientModel[]> {
        return this.http.get<IngredientModel[]>(this.baseUrl);
    }

    getIngredientById(id: string): Observable<IngredientModel> {
        return this.http.get<IngredientModel>(`${this.baseUrl}/${id}`);
    }

    createIngredient(ingredient: Partial<IngredientModelPost>): Observable<IngredientModel> {
        return this.http.post<IngredientModel>(this.baseUrl, ingredient);
    }

    patchIngredient(id: string, ingredient: Partial<IngredientModelPost>): Observable<IngredientModel> {
        return this.http.patch<IngredientModel>(`${this.baseUrl}/${id}`, ingredient);
    }

    deleteIngredient(id: string): Observable<IngredientModel> {
        return this.http.delete<IngredientModel>(`${this.baseUrl}/${id}`);
    }
}