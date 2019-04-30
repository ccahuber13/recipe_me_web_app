// Global app controller

// When importing an NPM module just use the name of the dependency. When importing your own modules, use file path.
// Method # 1 =  import {add, multiply, ID } from './views/searchView';
// Method # 2 =  import {add as a, multiply as m, ID } from './views/searchView';
// Method # 3 =  import * as searchView from './views/searchView';

//   0b7ee6686a8c442fb06fb2bc70d2ac58  
// https://www.food2fork.com/api/search
// https://www.food2fork.com/api/get

// STATE - After all modules implemented, think of current state of our app. What is the recipe? What is the search query? How many servings are being calculated? What's in the shopping list?
// All data in current state and current moment is the current state. We want this to be all in one single object.

import Search from './models/Search';
import {elements} from './views/base';
import * as searchView from './views/searchView';

/** Global state of the app - Stored in one central object/variable to be accessed throughout the contorller.
 * -Search object
 * -Current recipe object
 * -Shopping list object
 * -Liked recipes
 */
// Start with empty object so each time app is reloaded, start with empty object.
const state = {};

// Use an async function to use await for API results within.
const controlSearch = async () => {
    // 1. Get query from view
    const query = searchView.getInput();//TODO
    if(query) {
        // 2. New search object and add to state
        state.search = new Search(query);

        // 3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        
        // 4. Search for recipes
        // Use await to wait for results and returns a promise. getResults is an async function.
        await state.search.getResults();

        // 5. render results on UI - Only want to happen after getting the results from API
        searchView.renderResults(state.search.result);
    }
}

// create callbackfunction > pass event (e) object into callback.
elements.searchForm.addEventListener('submit', e => {
    // Stops the page from re-loading on each submit
    e.preventDefault();
    // Run control search function. Place outside event listener to keep code clean and DRY.
    controlSearch();
});

// store results of new Search object with (query);

