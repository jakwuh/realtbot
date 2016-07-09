import {Model} from 'backbone';

export default class Flat extends Model {

    /**
     * @param {number} options.price
     * @param {number} options.bedrooms
     * @param {string} options.currency
     * @param {string} options.advertiser
     * @param {string} options.url
     * @param {number} options.lat
     * @param {number} options.lon
     * @param {string} options.address
     * @param {string[]} options.images
     */
    constructor(options) {
        super(options);
    }

    /**
     * @returns {string}
     */
    getAddress() {
        return this.get('address');
    }

    /**
     * @returns {string[]}
     */
    getImages() {
        return this.get('images');
    }

    /**
     * @param {string[]} images
     */
    setImages(images) {
        return this.set({images});
    }

    /**
     * @returns {number}
     */
    getAmount() {
        return this.get('amount');
    }

    /**
     * @returns {string}
     */
    getCurrency() {
        return this.get('currency');
    }

    /**
     * @returns {number}
     */
    getLat() {
        return this.get('lat');
    }

    /**
     * @returns {number}
     */
    getLon() {
        return this.get('lon');
    }

    /**
     * @returns {number}
     */
    getBedrooms() {
        return this.get('bedrooms');
    }

    /**
     * @returns {string}
     */
    getAdvertiser() {
        return this.get('advertiser');
    }

    /**
     * @returns {string}
     */
    getUrl() {
        return this.get('url');
    }
    
}
