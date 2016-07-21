import {expect} from 'chai';
import Messenger from './messenger';
import Flat from '../models/flat';

describe('Messenger', function () {

    let messenger;

    beforeEach(function () {
        messenger = new Messenger();
    });

    it('should compose correct message', function() {

        const flat = new Flat({
            amount: 1,
            currency: 'UsD',
            bedrooms: 2,
            advertiser: 'agent',
            url: 'http://url',
            lat: 1,
            lon: 2,
            address: 'addr',
            images: ['http://image'],
            is_agency: true
        });

        const lines = [
            `Двухкомнатная квартира за $1 от агента http://url`,
            `Точный адрес: addr`
        ];

        expect(messenger.describeFlat(flat)).to.be.deep.equal({
            text: lines.join('\n'),
            attachments: [{
                text: 'Фотография 1',
                image_url: 'http://image'
            }]
        })

    });

});
