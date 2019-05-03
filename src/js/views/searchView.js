import { elements } from './base';

export const getInput = () => elements.searchInput.value;

// Wrap in curly braces so not an implicit return. Don't want to return a value, 
// just set the in put to nothing.
export const clearInput = () => {
    elements.searchInput.value = '';
};

// Clear results
export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        // return the result
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

// type: prev or next
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page -1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        // Button to go next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `
    } else if (page === pages && pages > 1) {
        // Buttons go to previous page
        button = createButton(page, 'prev');
    };

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

// Loop through all recipe results and call renderRecipe function on each of them.
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // Creating pagination of results.
    // Dynamically render the page results depending on which page you are on.
    // Example - page 3 - 1 = 2 * 10 = start at [20]
    const start = (page - 1) * resPerPage;
    // ex - 3 * 10 = end on [30]
    const end = page * resPerPage;
    // Slice from start up to number before end but not end itself.
    recipes.slice(start, end).forEach(renderRecipe);

    // render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};