import {expect} from 'chai';
import Logger, {LEVELS} from './logger';

describe('Logger', function() {

    function logAllTypes(logger) {
        logger.error('');
        logger.info('');
        logger.log('');
        logger.debug('');
    }

    const logCountMap = {
        [LEVELS.ERROR]: 1,
        [LEVELS.INFO]: 2,
        [LEVELS.LOG]: 3,
        [LEVELS.DEBUG]: 4
    };

    let counter = 0;
    beforeEach(function() {
        counter = 0;
    });

    const writer = {
        write: () => ++counter
    };

    for (let level in logCountMap) {
        it(`could have level = ${level}`, function() {
            const logger = new Logger({writer, level: level});
            logAllTypes(logger);
            expect(counter).to.be.equal(logCountMap[level]);
        });
    }

});
