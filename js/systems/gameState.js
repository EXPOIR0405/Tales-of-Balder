import { locations } from '../data/locations.js';

export class GameState {
    constructor() {
        this.hp = 100;
        this.maxHp = 100;
        this.gold = 0;
        this.inventory = [];
        this.currentLocation = null;
    }

    setLocation(locationId) {
        this.currentLocation = {
            ...locations[locationId],
            id: locationId
        };
    }
} 