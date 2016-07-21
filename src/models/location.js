import {Model} from 'backbone';
import {getDistance} from '../utils/math';

export default class Location extends Model {

    /**
     * @param {Flat} flat
     * @return boolean
     */
    test(flat) {
        const points = this.get('points');
        const location = flat.getLocation();
        return !points.find(p => getDistance(location, p) >= p.max);
    }

    /**
     * @param {Flat} flat
     * @returns {{name: string, distance: number}[]}
     */
    getDistancesFrom(flat) {
        const location = flat.getLocation();
        const points = this.get('points');
        return points.map(p => ({
            name: p.name,
            distance: getDistance(location, p)
        }));
    }

    getName() {
        return this.get('name');
    }

}
