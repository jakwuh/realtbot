import 'source-map-support/register';
import 'babel-polyfill';
import {extend, find} from 'lodash';
import {createBot} from '../bot';
import config from '../configs/app.json';
import Storage from '../libs/storage';
import Onliner from '../providers/onliner';
import Confine from '../models/confine';
import Logger, {LEVELS} from '../libs/Log/logger';
import Messenger from '../libs/messenger';
import co from 'co';

const storage = new Storage({id: 'app', path: config.dbpath});
const confine = new Confine();
const logger = new Logger({level: LEVELS.LOG});
const onliner = new Onliner({confine, logger});
const messenger = new Messenger({confine});

createBot({token: process.env.SLACK_TOKEN}).then(({bot, controller}) => {

    logger.info('Bot is running');

    let channel = storage.get('channel');
    controller.on('group_joined,channel_joined', (bot, message) => {
        channel = message.channel.id;
        storage.set('channel', channel);
        logger.info('Joined channel');
    });

    function run() {
        if (!channel) return;
        co(onliner.fetchAll())
            .then(flats => {
                const urls = storage.get('urls') || [];
                const newFlats = flats.filter(flat => !urls.includes(flat.getUrl()));
                logger.info(`Found ${newFlats.length} new flats`);
                newFlats.splice(1);
                logger.log(`Processing ${newFlats.length} new flats`);
                return newFlats;
            })
            .then(flats => Promise.all(flats.map(f => onliner.fetchOne(f)).map(co)))
            .then(flats => {
                flats.map(f => bot.say({channel, ...messenger.describeFlat(f)}));
                storage.set('urls', (storage.get('urls') || []).concat(flats.map(flat => flat.getUrl())));
                logger.info('Storage was updated');
            })
            .catch(e => logger.error(e.stack || e));

    }

    run();
    setInterval(run, 120000);

});
