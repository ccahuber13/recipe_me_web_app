export default class Likes {
    // Initiate empty array to store liked recipes
    constructor() {
        this.likes = [];
    }
    // Add a recipe to the Likes list. Want to display title, author, img. Get id for deletion and addition.
    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        // Take out item at this index, take only 1 element starting from index. Mutates original array and removes item and index.
        this.likes.splice(index, 1);
    }

    isLiked(id) {
        // When recipe loads - is it liked?
        // Find the index of id and see if it's different from -1. Different from -1 means it's liked.
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        // Get the number of likes and return.
        return this.likes.length;
    }
};