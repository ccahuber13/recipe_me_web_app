// Axios is an HTTPS request package. Using over Fetch because Fetch does not support all older browsers.
import axios from 'axios';
import {key, proxy} from '../config';


// To export one thing, use a default export. Then import into your other file.
// Data model for the search - query + search reuslts

// Export the Search class to export search class to other modules.
export default class Search {
    // (query) is the query we need to specify when creating a new search object
    constructor(query) {
        // query is attached to created object that is input.
        this.query = query;
    }
    // Define the query method.
    async getResults() {

        // returns a promise; Saved to res variable
        try {
            // Use this.query because reading the query from the object itself that is created.
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            // Search results are encapsulated. The results and search query are within the created object.
            this.result = res.data.recipes;
            console.log('Query running');
        } catch(error) {
            alert(error);
        }
    };
    
}

