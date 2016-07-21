import {expect} from 'chai';
import ConsoleWriter from './console_writer';

describe('ConsoleWriter', function() {

    it('should log prepend time to the message and log it to console', function() {
        const log = console.log;
        console.log = function(message) {
            log(message);
            const regexp = /^\[[0-9: PAM]+]: test\s*$/;
            console.log = log;
            expect(regexp.test(message)).to.equal(true);
        };
        (new ConsoleWriter).write('test');
    });

});
