import {Model} from 'backbone';

export default class Confine extends Model {

    defaults() {
        return {
            bedrooms: []
        };
    }

    /**
     * @returns {number[]}
     */
    getAllowedBedrooms() {
        return this.get('bedrooms');
    }

    /**
     * @returns {number}
     */
    getCenterLat() {
        return this.get('center_lat');
    }

    /**
     * @returns {number}
     */
    getCenterLon() {
        return this.get('center_lon');
    }

    /**
     * @returns {number}
     */
    getAllowedRadius() {
        return this.get('allowed_radius');
    }

}
