
class RichContentMessage {
    /**
     * Model to build Rich Response message
     * @param {any} options keys defining rich message
     */
    constructor(options) {
        this.type = options.type;
        this.title = options.title ? options.title : null;
        this.subtitle = options.subtitle ? options.subtitle : null;
        this.event = options.event ? options.event : null;
        this.text = options.text ? options.text : null;
        this.image = options.image ? options.image : null;
    }
}
module.exports = RichContentMessage;