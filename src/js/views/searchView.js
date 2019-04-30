import { elements } from './base';

export const getInput = () => elements.searchInput.value;

// Wrap in curly braces so not an implicit return. Don't want to return a value, 
// just set the in put to nothing.
export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
}

// Limit title length of recipe. 
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    // 1. Test if title is longer than limit
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        return `${newTitle.join(' ')} ...`;
    } 
    return title;
}

// Get a single recipe and render it
const renderRecipe = recipe => {
    const markup = ` 
        <li>
            <a class="results__link results__link--active" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="Test">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// Loop through all recipe results and call renderRecipe function on each of them.
export const renderResults = recipes => {
    recipes.forEach(renderRecipe)
};