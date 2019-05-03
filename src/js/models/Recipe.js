
// Axios is an HTTPS request package. Using over Fetch because Fetch does not support all older browsers.
import axios from 'axios';
import {key, proxy} from '../config';

// Create a single recipe object to display selected recipe from search.
export default class Recipe {
    // pass in unique ID to run ajax call later for recipe details.
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            alert('Something went wrong :(');
        }
    }

    calcTime() {
        // Assuming 15 min per 3 ingredients. Generic calculation.
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    // Parse out the ingredients of the recipe to standardize measurements
    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounce', 'ounces', 'teaspoon', 'teaspoons', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

        // Loop over each element, before function and return to new array.
        const newIngredients = this.ingredients.map(el => {
            // 1. Uniform units
            let ingredients = el.toLowerCase();
            // Loop over unitsLong array and replace with the shorter version from unitsShort array.
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitShort[i]);
            });

            // 2. Remove parenthesis
            ingredient = ingredient.replace(/ *\([^))]*\) */g, '');
            // 3. Parse ingredients into count, unit and ingredient

            return ingredient;
        })
        this.ingredients = newIngredients;
    }
};
