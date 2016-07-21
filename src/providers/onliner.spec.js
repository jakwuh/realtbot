import {expect} from 'chai';
import Onliner from './onliner';
import Confine from '../models/confine';
import Logger from '../libs/Log/logger';
import Flat from '../models/flat';
import onlinerFixture from './fixtures/onliner.json';
import co from 'co';

describe('Onliner', function () {

    let onliner;
    const confine = new Confine({bedrooms: [1, 2]});
    const logger = new Logger();

    beforeEach(function () {
        onliner = new Onliner({confine, logger});
    });

    it('should correctly return rent_type', function () {
        expect(onliner.getRentType(1)).to.equal('1_room');
        expect(onliner.getRentType(2)).to.equal('2_rooms');
        expect(onliner.getRentType(3)).to.equal('3_rooms');
    });

    it('should correctly generate params', function () {
        expect(onliner.generateParams())
            .to.have.property('rent_type')
            .that.is.an('array')
            .that.deep.equals(['1_room', '2_rooms']);
    });

    it('should correctly unify images', function () {
        const images = [
            'https://t.x/k/4x4/id1.png',
            'https://t.x/k/8x8/id1.png',
            'https://t.x/k/7x7/id1.png'
        ];
        expect(onliner.unifyImages(images)).to.deep.equal(['https://t.x/k/8x8/id1.png']);
    });

    it('should correctly fetch all flats', function () {
        onliner.fetchFlatsPage = page => Promise.resolve(page > 1 ? [] : [onlinerFixture]);
        return co(onliner.fetchAll()).then(([flat]) => {
            expect(flat.getAmount()).to.be.equal(parseFloat(onlinerFixture.price.amount));
            expect(flat.getBedrooms()).to.be.equal(parseFloat(onlinerFixture.rent_type));
            expect(flat.getLat()).to.be.equal(parseFloat(onlinerFixture.location.latitude));
            expect(flat.getLon()).to.be.equal(parseFloat(onlinerFixture.location.longitude));
            expect(flat.getCurrency()).to.be.equal(onlinerFixture.price.currency.toUpperCase());
            expect(flat.isAgency()).to.be.equal(false);
            expect(flat.getUrl()).to.be.equal(onlinerFixture.url);
            expect(flat.getAddress()).to.be.equal(onlinerFixture.location.address);
        });
    });

    it('should correctly fetch one flat', function () {
        onliner.fetchFlatImages = id => Promise.resolve(['https://image.url']);
        return co(onliner.fetchOne(new Flat({id: 1}))).then(flat => {
            expect(flat.getImages()).to.be.deep.equal(['https://image.url']);
        });
    });

});
