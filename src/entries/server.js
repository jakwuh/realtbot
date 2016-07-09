import 'source-map-support/register';
import {extend, find} from 'lodash';
import {createBot} from '../bot';
import config from '../configs/app.json';
import Storage from '../libs/storage';
import Onliner from '../providers/onliner';
import Confine from '../models/confine';
import Logger from '../libs/logger';
import Messenger from '../libs/messenger';
import co from 'co';

const logger = new Logger({});
const messenger = new Messenger({});
const confine = new Confine({
    bedrooms: [1, 2]
});
const storage = new Storage({
    id: 'app',
    path: config.dbpath
});
const onliner = new Onliner({
    confine,
    logger
});

createBot({token: process.env.SLACK_TOKEN}).then(bot => {

    function run() {
        co(onliner.fetchAll())
            .then(flats => {
                logger.debug(`Fetched ${flats.length} flats`);
                const urls = storage.get('urls') || [];
                const newFlats = flats.filter(flat => !urls.includes(flat.getUrl()));
                logger.debug(`Found ${newFlats.length} new flats`);
                newFlats.splice(1);
                logger.debug(`Processing ${newFlats.length} new flats`);
                return newFlats;
            })
            .then(flats => {
                return Promise.all(flats.map(flat => co(onliner.fetchOne(flat))));
            })
            .then(flats => {
                flats.map(messenger.describeFlat.bind(messenger)).map(text => bot.say(text));
                return flats;
            })
            .then(flats => {
                storage.set('urls', (storage.get('urls') || []).concat(flats.map(flat => flat.getUrl())));
                logger.debug('Storage was updated');
            })
            .catch(err => {
                logger.error(err.stack || err);
            });

    }

    run();
    if (process.env.NODE_ENV === 'production') {
        setInterval(run, 120000);
    } else {
        setTimeout(() => console.log('finished'), 10000000);
    }

});
