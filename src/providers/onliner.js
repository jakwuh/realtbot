import rp from 'request-promise';
import {extend, find, filter, uniq} from 'lodash';
import {writeFileSync, readFileSync} from 'fs';
import Flat from '../models/flat';

export default class Onliner {

    /**
     * @param {Logger} logger
     * @param {Confine} confine
     */
    constructor({logger, confine}) {
        this.setLogger(logger);
        this.setConfine(confine);
    }

    /**
     * @param {Logger} logger
     */
    setLogger(logger) {
        this.logger = logger;
    }

    /**
     * @returns {Logger}
     */
    getLogger() {
        return this.logger;
    }

    /**
     * @param {Confine} confine
     */
    setConfine(confine) {
        this.confine = confine;
    }

    /**
     * @returns {Confine}
     */
    getConfine() {
        return this.confine;
    }

    /**
     * @param {string} message
     */
    debug(message) {
        this.getLogger().debug(message);
    }

    /**
     * @param {number} rooms
     * @returns {string}
     */
    getRentType(rooms) {
        return {
            1: '1_room',
            2: '2_rooms',
            3: '3_rooms'
        }[rooms];
    }

    /**
     * @returns {{}}
     */
    generateParams() {
        return {
            rent_type: this.getConfine().getAllowedBedrooms().map(this.getRentType),
            bounds: {
                lb: {
                    lat: 53.88269035388989,
                    long: 27.50448703765869
                },
                rt: {
                    lat: 53.89586751305278,
                    long: 27.53195285797119
                }
            }
        }
    }

    /**
     * @param {number} id
     * @returns {string[]}
     */
    fetchFlatImages(id) {
        this.debug(`Fetching images for flat ${id}`);
        const regexString = `\((https\:\/\/content\.onliner\.by\/apartment\_rentals\/[^\)\"\]*)\)`;
        const imagesRegex = new RegExp(regexString, 'g');
        const url = `https://r.onliner.by/ak/apartments/${id}`;
        return rp(url).then(page => this.unifyImages(page.toString().match(imagesRegex) || []));
    }

    /**
     * @param {string[]} images
     * @returns {string[]}
     */
    unifyImages(images) {
        const dimRegex = /(\d+)x(\d+)/;
        const idRegex = /\/(\w+)\.\w+$/;
        const ids = uniq(images.map(image => image.match(idRegex)[1]));
        images = images.sort(function (a, b) {
            const [, w_a, h_a] = a.match(dimRegex);
            const [, w_b, h_b] = b.match(dimRegex);
            return (w_b * h_b - w_a * h_a);
        });
        return ids.map(id => find(images, image => image.includes(id)));
    }

    /**
     * @param {number} page
     * @returns {Promise<{}[]>}
     */
    fetchFlatsPage(page) {
        const options = {
            json: true,
            qs: extend(this.generateParams(), {page}),
            uri: 'https://ak.api.onliner.by/search/apartments'
        };
        this.debug(`Fetching flats on page ${page}`);
        return rp(options).then(response => response.apartments);
    }

    /**
     * @yields {{}[]}
     */
    *fetchAll() {
        const flats = [];
        let results;
        let page = 0;
        do {
            results = yield this.fetchFlatsPage(++page);
            this.debug(`Fetched ${results.length} flats from page ${page}`);

            for (const flat of results) {
                flats.push(new Flat({
                    id: flat.id,
                    amount: Number(flat.price.amount),
                    currency: flat.price.currency,
                    bedrooms: Number(flat.rent_type.slice(0, 1)),
                    advertiser: flat.contact.owner ? 'owner' : 'agent',
                    url: flat.url,
                    lat: flat.location.latitude,
                    lon: flat.location.longitude,
                    address: flat.location.address
                }));
            }
        } while (results.length);
        return flats;
    }

    *fetchOne(flat) {
        flat.setImages(yield this.fetchFlatImages(flat.id));
        return flat;
    }

}
