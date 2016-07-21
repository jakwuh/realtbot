import ConsoleWriter from './console_writer';

export const LEVELS = {
    ERROR: 0,
    INFO: 1,
    LOG: 2,
    DEBUG: 3
};

export default class Logger {

    /**
     * @param {number} [level]
     * @param {{write: function}} writer
     */
    constructor({level = LEVELS.INFO, writer = new ConsoleWriter()} = {}) {
        this.level = level;
        this.writer = writer;
    }

    /**
     * @param {string} message
     */
    error(message) {
        if (this.level >= LEVELS.ERROR) {
            this.writer.write(message);
        }
    }

    /**
     * @param {string} message
     */
    info(message) {
        if (this.level >= LEVELS.INFO) {
            this.writer.write(message);
        }
    }

    /**
     * @param {string} message
     */
    log(message) {
        if (this.level >= LEVELS.LOG) {
            this.writer.write(message);
        }
    }

    /**
     * @param {string} message
     */
    debug(message) {
        if (this.level >= LEVELS.DEBUG) {
            this.writer.write(message);
        }
    }

}
