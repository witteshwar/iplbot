class TextMessage {
    /**
     * Model to create a text message
     * @param {string} text Simple text message text
     */
    constructor(text) {
        this.text = new Text(text);
    }
}

class Text {
    constructor(text) {
        this.text = [text]
    }
}

module.exports = TextMessage;