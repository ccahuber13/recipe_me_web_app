import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit, 
            ingredient
        }
        // Push item to array
        this.items.push(item);
        //return the item (Good practice to return the object)
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);
    }

    // Loop through items, find item with specific ID, return and update count to new count.
    updateCount(id, newCount){
        this.items.find(el => el.id === id).count = newCount;
    }
}