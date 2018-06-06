const Gdax = require('gdax');
var currencyType = "LTC-USD";

function logger(s) {
    console.log("[" + new Date() + "] " + s);
}

class Main {
    connect() {        
        var self = this;
        this.websocket = new Gdax.WebsocketClient([currencyType], 'https://ws-feed.gdax.com', null, { heartbeat: true });
        this.websocket.on('open', s => {
            logger("Connected");

            const subscribeMessage = {
                type: 'subscribe',
                product_ids: [currencyType],
                channels: [
                    "level2",
                    "heartbeat",
                    {
                        "name": "ticker",
                        "product_ids": [
                            currencyType
                        ]
                    }
                ]
            };

            self.websocket.socket.send(JSON.stringify(subscribeMessage));
        })

        this.websocket.on('message', data => {
            if (data !== null && data.type === 'ticker') {
                logger("Price is " + data.price);
            }
        });

        self.websocket.on('error', err => { logger("Error:" + err) });
        self.websocket.on('close', () => {
            logger("Closed connection!");
            // Attempt to reconnect
            self.connect();
        });
    }
}

var main = new Main();
main.connect();