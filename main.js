const tmi = require('tmi.js');
const opts = {
  identity: {
    username: 'botkatreque',
    password: '***REMOVED***'
  },
  channels: [
    'katreque'
  ]
};

const client = new tmi.client(opts);

client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
client.connect();

function onMessageHandler (target, context, msg, self) {
  if (self) { return; }

  const comando = msg.trim();

  if (comando === "!emote") {
    client.emoteonly("katreque")
    .then(() => {
        client.say(':Kappa');
    })
    .catch((r) => {
        console.log(r);
    })
  }

  if (comando === "!emoteoff") {
    client.emoteonlyoff("katreque")
    .then(() => {
        client.say('Modo de Emotes on!');
    })
    .catch((r) => {
        console.log(r);
    })
  }

  if (comando === "Kappa") {
    return client.say("Kappa");
  }
}

function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}