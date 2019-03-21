const tmi = require('tmi.js');
const OBSWebSocket = require('obs-websocket-js');
require('dotenv').config();

const opts = {
  identity: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD
  },
  channels: [
    'katreque'
  ]
};
const client = new tmi.client(opts);
const obs = new OBSWebSocket();

let YoFila = {
  array: [],
  flag: true
};

obs.connect({
  address: process.env.HOST,
  password: process.env.HOSTPW
})
.then(() => {
  console.log(`Conectado e pronto!`);
})
.catch((err) => {
  console.log(err);
})

obs.on('error', err => {
  console.error('socket error:', err);
});

client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
client.connect();
ativacaoDeCenaYo();

function onMessageHandler (target, context, msg, self) {
  if (self) { return; }

  const comando = msg.trim();
  
  switch (comando) {
    case "Yo":
      YoFila.array.push(context["display-name"]);
      break;
  
    default:
      break;
  }

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
    return client.say(":Kappa");
  }
}

function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

function ativacaoDeCenaYo () {
  setInterval(() => {
    if (YoFila.array.length && YoFila.flag) {
      Yo(YoFila.array[0]);
      YoFila.array = YoFila.array.slice(1);
      YoFila.flag = false;
    }
  }, 1000);
};

function Yo (nome) {
  let cenaAtual;

    obs.send("GetCurrentScene")
    .then((data) => {
      cenaAtual = data.name;
  
      return obs.send('SetTextGDIPlusProperties', {
        "scene-name": "ChikaYoScene",
        source: "Nome",
        text: nome
      })
    })
    .then(() => {
      obs.send('SetSceneItemProperties', {
        "scene-name": cenaAtual,
        item: "ChikaYoScene",
        visible: true
      });
    
      setTimeout(() => {
        obs.send('SetSceneItemProperties', {
          "scene-name": cenaAtual,
          item: "ChikaYoScene",
          visible: false
        });

        YoFila.flag = true;
      }, 3000);
    })
    .catch((err) => {
      console.log(err);
    })
};