import {expect} from 'chai';
import Provider from './provider';
import Confine from '../models/confine';
import Logger from '../libs/Log/logger';

describe('Provider', function () {

    const confine = new Confine({bedrooms: [1, 2]});
    const logger = new Logger();

    it('should correctly construct', function () {
        const provider = new Provider({confine, logger});
        expect(provider.getLogger()).to.equal(logger);
        expect(provider.getConfine()).to.equal(confine);
    });

});
