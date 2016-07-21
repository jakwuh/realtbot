export default class ConsoleWriter {
    
    /**
     * @param {string} message
     */
    write(message) {
        const time = (new Date).toLocaleTimeString();
        console.log(`[${time}]: ${message}`);
    }
    
}
