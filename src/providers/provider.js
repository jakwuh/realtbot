export default class Provider {

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
     * @param {string} message
     */
    log(message) {
        this.getLogger().log(message);
    }

    /**
     * @param {string} message
     */
    info(message) {
        this.getLogger().info(message);
    }

}
