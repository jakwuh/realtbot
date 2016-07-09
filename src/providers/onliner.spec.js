import {expect} from 'chai';
import Onliner from '../providers/onliner';
import Confine from '../models/confine';
import Logger from '../libs/logger';
import Flat from '../models/flat';
import co from 'co';

describe('Onliner', function () {

    let onliner;
    const confine = new Confine({bedrooms: [1, 2]});
    const logger = new Logger();

    beforeEach(function () {
        onliner = new Onliner({confine, logger});
    });

    it('should correctly construct', function () {
        expect(onliner.getLogger()).to.equal(logger);
        expect(onliner.getConfine()).to.equal(confine);
    });

    it('should correctly return rent_type', function () {
        expect(onliner.getRentType(1)).to.equal('1_room');
        expect(onliner.getRentType(2)).to.equal('2_rooms');
        expect(onliner.getRentType(3)).to.equal('3_rooms');
    });

    it('should correctly generate params', function () {
        expect(onliner.generateParams()).to.have.property('rent_type')
            .that.is.an('array')
            .that.deep.equals(['1_room', '2_rooms']);
    });

    it('should correctly unify images', function () {
        const images = [
            'https://test.xyx/sdsa/40x40/id1.jpeg',
            'https://test.xyx/sdsa/80x80/id1.jpeg',
            'https://test.xyx/sdsa/70x70/id1.jpeg'
        ];
        expect(onliner.unifyImages(images))
            .to.deep.equal(['https://test.xyx/sdsa/80x80/id1.jpeg']);
    });

    it('should correctly fetch all flats', function () {
        onliner.fetchFlatImages = id => {
            return Promise.resolve(['1']);
        };
        onliner.fetchFlatsPage = page => {
            if (page > 1) {
                return [];
            }
            return Promise.resolve([{
                id: 136510,
                price: {amount: '200.00', currency: 'USD'},
                rent_type: '2_rooms',
                location: {
                    address: 'Минск, улица Розы Люксембург, 142',
                    latitude: 53.889904,
                    longitude: 27.510166
                },
                contact: {owner: true},
                url: 'https://r.onliner.by/ak/apartments/136510'
            }]);
        };
        return co(onliner.fetchAll()).then(([flat]) => {
            expect(flat.getAmount()).to.be.equal(200);
            expect(flat.getBedrooms()).to.be.equal(2);
            expect(flat.getLat()).to.be.equal(53.889904);
            expect(flat.getLon()).to.be.equal(27.510166);
            expect(flat.getCurrency()).to.be.equal('USD');
            expect(flat.getAdvertiser()).to.be.equal('owner');
            expect(flat.getUrl()).to.be.equal('https://r.onliner.by/ak/apartments/136510');
            expect(flat.getAddress()).to.be.equal('Минск, улица Розы Люксембург, 142');
        });
    });

    it('should correctly fetch oner flat', function () {
        onliner.fetchFlatImages = id => {
            return Promise.resolve(['1']);
        };
        return co(onliner.fetchOne(new Flat({id: 1}))).then(flat => {
            expect(flat.getImages()).to.be.deep.equal(['1']);
        });
    
    });

});
