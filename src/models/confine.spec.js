import {expect} from 'chai';
import Flat from './flat';
import Confine from './confine';

describe('Confine', function () {

    const flat = new Flat({
        lat: 52,
        lon: 28
    });
    const confine = new Confine({
        locations: [{
            name: 'test 1',
            points: [{
                name: 'test',
                lat: 52,
                lon: 27.5,
                max: 1000
            }]
        }, {
            name: 'test 2',
            points: [{
                name: 'test',
                lat: 52,
                lon: 27.9985,
                max: 1000
            }]
        }]
    });

    it('should properly find location', function () {
        const location = confine.findLocation(flat);
        expect(location.getName()).to.be.equal('test 2');
    });

});
