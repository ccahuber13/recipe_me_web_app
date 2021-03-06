// Global app controller

// When importing an NPM module just use the name of the dependency. When importing your own modules, use file path.
// Method # 1 =  import {add, multiply, ID } from './views/searchView';
// Method # 2 =  import {add as a, multiply as m, ID } from './views/searchView';
// Method # 3 =  import * as searchView from './views/searchView';

//   0b7ee6686a8c442fb06fb2bc70d2ac58  
// https://www.food2fork.com/api/search
// https://www.food2fork.com/api/get

// STATE - After all modules implemented, think of current state of our app. What is the recipe? What is the search query? 
// How many servings are being calculated? What's in the shopping list?
// All data in current state and current moment is the current state. We want this to be all in one single object.

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';


/** Global state of the app - Stored in one central object/variable to be accessed throughout the controller.
 * -Search object
 * -Current recipe object
 * -Shopping list object
 * -Liked recipes
 */
// Start with empty object so each time app is reloaded, start with empty object.
const state = {};

/**
 * SEARCH CONTROLLER =========================================================
 */
// Use an async function to use await for API results within.
const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput();//TODO
    // // TESTING
    // const query = 'pizza';
    
    if(query) {
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        
        try {
            // 4. Search for recipes
            // Use await to wait for results and returns a promise. getResults is an async function.
            await state.search.getResults();

            // 5. render results on UI - Only want to happen after getting the results from API
            clearLoader();
            searchView.renderResults(state.search.result);

        } catch (err) {
            alert('Could not get search');
            clearLoader();
        }
    }
}

// create callback function > pass event (e) object into callback.
elements.searchForm.addEventListener('submit', e => {
    // Stops the page from re-loading on each submit
    e.preventDefault();
    // Run control search function. Place outside event listener to keep code clean and DRY.
    controlSearch();
});

// // TESTING
// window.addEventListener('load', e => {
//     e.preventDefault();
//     controlSearch();
// });


// store results of new Search object with (query);
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        // Grab page number from html data attr. Set the base to 10 for number formatting.
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});


/**
 * RECIPE CONTROLLER =========================================================
 */
const controlRecipe = async () => {
    // window is entire browser, location gets entire URL, hash gets the hash ID of page.
    // Use replace string method to remove the hashtag of id.
    const id = window.location.hash.replace('#', '');
    // Only do if ID exists
    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        // Display render gfx in '.recipe'
        renderLoader(elements.recipe);

        // Highlight selected search item
        if(state.search){searchView.highlightSelected(id);};

        // Create new recipe
        state.recipe = new Recipe(id);
      
        // TESTING
        // window.r = state.recipe;

        // Get recipe data
        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            // Render recipe 
            clearLoader();
            recipeView.renderRecipe(state.recipe);
            
        } catch (err) {

            alert('Error getting recipe!');
        }
    }
}

/**
 * LIST CONTROLLER =========================================================
 */
const controlList = () => {
    // Create a new list IF there is none yet.
    if(!state.list) state.list = new List();

    // Add each ingredient to the list and UI. Ingredients are stored in the current state recipe.
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
};


/**
* EVENT LISTENERS BUTTON CLICKS =========================================================
*/

// Listen for a hash change and run controlRecipe function.
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

// Attach event listener to multiple items. Loop over event type strings, call window.addEventListener on each of them.
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    // if clicked target matches this css class, or any child * // may click on icon/graphic/element child of .btn-decrease.
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease recipe servings only if greater than 1. 
        if (state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServIng(state.recipe);
        }

    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Decrease button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServIng(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Call control list function on click
    };
    
});


