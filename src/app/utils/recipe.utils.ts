import { RecipeModel } from "../models/recipe.model";

export const getCaloriesForRecipe = (recipe: RecipeModel): number => {
    return recipe.ingredients.reduce((acc, ingAsso) =>
        acc + (ingAsso.ingredient.calories ?? 0) * (ingAsso.quantity ?? 0), 0
    ) / (recipe.servings === 0 ? 1 : recipe.servings);
};

export const getPricesForRecipe = (recipe: RecipeModel): number => {
    return recipe.ingredients.reduce((acc, ingAsso) =>
        acc + (ingAsso.ingredient.price ?? 0) * (ingAsso.quantity ?? 0), 0
    ) / (recipe.servings === 0 ? 1 : recipe.servings);
}