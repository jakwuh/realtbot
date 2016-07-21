import rp from 'request-promise';
import {extend, find, filter, uniq} from 'lodash';
import Flat from '../models/flat';
import Provider from './provider';

export default class Onliner extends Provider {

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
        const confine = this.getConfine();
        return {
            rent_type: confine.getAllowedBedrooms().map(this.getRentType),
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
        this.log(`Fetching images for flat ${id}`);
        const regexString = `\((https\:\/\/content\.onliner\.by\/apartment\_rentals\/[^\)\"\]*)\)`;
        const imagesRegex = new RegExp(regexString, 'g');
        const url = `https://r.onliner.by/ak/apartments/${id}`;
        return rp(url)
            .then(page => this.unifyImages(page.toString().match(imagesRegex) || []))
            .then(images => {
                this.log(`Fetched ${images.length} image(s) for flat ${id}`);
                this.debug('Fetched images: ' + images.join(', '));
                return images;
            });
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
     * @returns {Promise.<{}[]>}
     */
    fetchFlatsPage(page) {
        const options = {
            json: true,
            qs: extend(this.generateParams(), {page}),
            uri: 'https://ak.api.onliner.by/search/apartments'
        };
        this.debug(`Fetching flats on page ${page}`);
        return rp(options).then(({apartments}) => {
            this.log(`Fetched ${apartments.length} flats on page ${page}`);
            this.debug('Fetched apartments: ' + apartments.map(data => JSON.stringify(data)).join('\n'));
            return apartments;
        });
    }

    /**
     * @returns {Flat[]}
     */
    *fetchAll() {
        const flats = [];
        let results;
        let page = 0;
        this.log('Fetching all flats');
        do {
            results = yield this.fetchFlatsPage(++page);

            for (const flat of results) {
                flats.push(new Flat({
                    id: flat.id,
                    amount: parseFloat(flat.price.amount),
                    currency: flat.price.currency,
                    bedrooms: parseFloat(flat.rent_type),
                    is_agency: !flat.contact.owner,
                    url: flat.url,
                    lat: parseFloat(flat.location.latitude),
                    lon: parseFloat(flat.location.longitude),
                    address: flat.location.address
                }));
            }
        } while (results.length);
        this.log('Fetched all flats');
        const confine = this.getConfine();
        return flats.filter(f => confine.test(f));
    }

    /**
     * @param {Flat} flat
     * @returns {Flat}
     */
    *fetchOne(flat) {
        this.log(`Fetching precise information for flat ${flat.id}`);
        flat.setImages(yield this.fetchFlatImages(flat.id));
        this.log(`Fetched precise information for flat ${flat.id}`);
        return flat;
    }

}
