
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
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        // Loop over each element, before function and return to new array.
        const newIngredients = this.ingredients.map(el => {
            // 1. Uniform units
            let ingredient = el.toLowerCase();
            // Loop over unitsLong array and replace with the shorter version from unitsShort array.
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2. Remove parenthesis
            ingredient = ingredient.replace(/ *\([^))]*\) */g, ' ');
            // 3. Parse ingredients into count, unit and ingredient
                // First split each word into a new array.
            const arrIng = ingredient.split(' ');
                // Find the index where the weight/size unit is located when we don't know which unit we are looking for specifically. 
                // findIndex on each element. Perform a test on each element with callback function.
                // includes method checks if passed in object exists and returns true/false.
                // will check if unit exists in unitsShort array, and return the index if true.
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
            // Initialize final ingredient object. Block scoped so init outsize of if/else statement below.
            let objIng;
            // If unit exists
            if (unitIndex > -1) {
                // If one of our units in unitsShort array exist
                // slice count from 0 up until it finds the unit. Assuming the first or second elements are counts.
                    // Ex. 1 1/2 cup, arrCount =  [1, 1/2] [cup]
                    // Ex. 1 cup, arrCount = [4]
                const arrCount = arrIng.slice(0, unitIndex);
                
                let count;
                // If only 1 count before unit
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    // Ex. [1, 1/2] [cup] eval('1+1/2') --> 1.5 = turns into javascript code.
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)) {
                // A number exists but not necessarily a unit in our array. ex - 1 package.
                // assuming first position is number, try to parse into int with base 10. "Coerce into true".
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    // List ingredient starting at second element and rest of array. Join array back into a string.
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // No Unit and No number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    // list entire ingredient
                    ingredient
                }
            }

            return objIng;
        })
        this.ingredients = newIngredients;
    }
};
