import uniqid from 'uniqid';

// array of ingredients for the shopping list
export default class List {
    constructor() {
        this.items = [];
    }

    // Add ingredient item to the array of items
    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit, 
            ingredient
        }
        // Push item to array
        this.items.push(item);
        //return the item to store in a var (Good practice to return the object)
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);
    }

    // Loop through items, find item with specific ID, return and update count to new count.
    // newCount comes from the value grabbed in our event listener for .shopping__count-value.
    updateCount(id, newCount){
        this.items.find(el => el.id === id).count = newCount;
    }
}