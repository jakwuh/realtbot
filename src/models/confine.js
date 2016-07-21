import {Model} from 'backbone';
import Location from './location';
import config from '../configs/confine.json';

export default class Confine extends Model {

    constructor({locations = [], ...rest} = config) {
        super(rest);
        this.locations = locations.map(config => new Location(config));
    }

    defaults() {
        return {
            bedrooms: [],
            locations: []
        };
    }

    /**
     * @returns {number[]}
     */
    getAllowedBedrooms() {
        return this.get('bedrooms');
    }

    /**
     * @param {Flat} flat
     * @returns {boolean}
     */
    test(flat) {
        if (!this.locations.length) {
            return true;
        }
        return Boolean(this.findLocation(flat));
    }

    /**
     * @param {Flat} flat
     * @returns {*}
     */
    findLocation(flat) {
        return this.locations.find(l => l.test(flat));
    }

}
