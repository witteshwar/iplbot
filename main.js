function main() {
    async function webhook(request, response) {
        response.json = {
            "fulfillmentMessages": [
                {
                    "text": {
                        "text": [
                            "Text response from webhook"
                        ]
                    }
                }
            ]
        }
    }

    return { webhook };
};

module.exports = main();
