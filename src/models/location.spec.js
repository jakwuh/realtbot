import {expect} from 'chai';
import Flat from './flat';
import Location from './location';

describe('Location', function() {

    const flat = new Flat({
        lat: 52,
        lon: 28
    });
    const location = new Location({
        points: [{
            name: "Test point",
            lat: 52,
            lon: 27.987,
            max: 1000
        }]
    });

    it('should properly test flat', function() {
        expect(location.test(flat)).to.be.equal(true);
    });

    it('should properly get distances from flat', function() {
        const result = location.getDistancesFrom(flat)[0];
        expect(result.name).to.be.equal('Test point');
        expect(result.distance).to.be.below(1000);
    });

});
