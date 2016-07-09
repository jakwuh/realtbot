export default class Messenger {

    /**
     * @param {number} amount
     * @param {string} currency
     * @returns {string}
     */
    describePrice(amount, currency) {
        return `${currency}${amount}`.replace(/usd/i, '$');
    }

    /**
     * @param {string} advertiser
     * @returns {string}
     */
    describeAdvertiser(advertiser) {
        return {
            'agent': 'агента',
            'owner': 'собственника'
        }[advertiser];
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

    describeFlat(flat) {
        const url = flat.getUrl();
        const images = flat.getImages();
        const address = flat.getAddress();
        const rooms = this.describeBedrooms(flat.getBedrooms());
        const advertiser = this.describeAdvertiser(flat.getAdvertiser());
        const price = this.describePrice(flat.getAmount(), flat.getCurrency());

        const lines = [
            `${rooms} квартира за ${price} от ${advertiser} ${url}`,
            // `${Math.round(distances.fromOffice)}м до офиса, ${Math.round(distances.fromMetro)}м до метро`,
            `Точный адрес: ${address}`
        ];
        return {
            'text': lines.join('\n'),
            'attachments': images.map((image, index) => ({
                'text': `Фотография ${index + 1}`,
                'image_url': image
            }))
        };
    }

}
