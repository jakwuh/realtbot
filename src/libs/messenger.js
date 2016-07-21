import Confine from '../models/confine';

export default class Messenger {

    /**
     * @param {Confine} confine
     */
    constructor({confine = new Confine()} = {}) {
        this.confine = confine;
    }

    /**
     * @param {number} amount
     * @param {string} currency
     * @returns {string}
     */
    describePrice(amount, currency) {
        return `${currency}${amount}`.replace(/usd/i, '$');
    }

    /**
     * @param {boolean} isAgency
     * @returns {string}
     */
    describeAdvertiser({isAgency}) {
        if (true === isAgency) {
            return 'агента';
        } else if (false === isAgency) {
            return 'собственника';
        } else {
            return 'агента либо собственника (неизвестно)';
        }
    }

    /**
     * @param {number} bedrooms
     * @returns {string}
     */
    describeBedrooms(bedrooms) {
        return {
            1: 'Однокомнатная',
            2: 'Двухкомнатная',
            3: 'Трехкомнатная'
        }[bedrooms];
    }

    describeLocation(flat) {
        const confine = this.confine;
        const location = confine.findLocation(flat);
        if (!location) return;
        const points = location.getDistancesFrom(flat);
        const distances = points.map(p => `${p.name} - ${parseInt(p.distance)}м`);
        return `Расположение: ${location.getName()} (${distances.join(', ')})`;
    }

    describeFlat(flat) {
        const url = flat.getUrl();
        const images = flat.getImages();
        const address = flat.getAddress();
        const rooms = this.describeBedrooms(flat.getBedrooms());
        const advertiser = this.describeAdvertiser({isAgency: flat.isAgency()});
        const price = this.describePrice(flat.getAmount(), flat.getCurrency());
        const location = this.describeLocation(flat);

        const lines = [`${rooms} квартира за ${price} от ${advertiser} ${url}`];
        if (location) lines.push(location);
        lines.push(`Точный адрес: ${address}`);

        return {
            'text': lines.join('\n'),
            'attachments': images.map((image, index) => ({
                'text': `Фотография ${index + 1}`,
                'image_url': image
            }))
        };
    }

}
