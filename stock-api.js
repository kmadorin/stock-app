const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const tokens = require('./tokens');
const users = require('./users');
const offers = require('./offers');

const tokenIdOptions = {
  describe: 'unique token id',
  demand: true,
  alias: 'tid'
}

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
// adding a new user on the bot start
app.get('/start/:id', (req, res)=>{
  var id = req.params.id;

  var user = users.addUser(id);

  res.send({
    user
  });

});

//listing all the users' tokens
app.get('/gettokensbyuser/:id/', (req, res)=>{
  var id = req.params.id;

  var tokens = users.getTokensByUserId(id);
  res.send(
    JSON.stringify(tokens, undefined, 2)
  );

});

// list all the offers

app.get('/offers', (req, res)=>{

  var offersListing = offers.getAll();
  res.send(
    JSON.stringify(offersListing, undefined, 2)
  );

});

//make new offer
app.post('/addOffer', (req, res)=>{

  var offer = offers.addOffer(req.body.seller, req.body.token, req.body.price);

  res.send(
    JSON.stringify(offer, undefined, 2)
  );

});

// accept offer
app.post('/acceptOffer', (req, res)=>{

  var offerAccepted = offers.acceptOffer(req.body.offer, req.body.buyer);

  if (offerAccepted.id) {
    res.send(
    `You've just successfully bought a ticket with id ${offerAccepted.token} from ${offerAccepted.seller}`
    );
  } else {
    res.send(
    `Operation cancelled`
    );
  }


});


app.listen(port, ()=>{
  console.log('Started up at port ', port);
});

module.exports = {app}

// const argv = yargs
//   .command('addtoken', 'Add a new token', {
//     tokenId: tokenIdOptions,
//     owner: {
//       describe: 'owner of the token',
//       demand: false,
//       alias: 'o'
//     }
//   })
//   .command('gettoken', 'Get a token by id', {
//     tokenId: tokenIdOptions,
//   })
//   .command('adduser', 'Register a new user', {
//     telegramId: {
//       describe: 'telegram id',
//       demand: true,
//       alias: 't'
//     },
//     email: {
//       describe: 'email',
//       demand: true,
//       alias: 'e'
//     },
//     name: {
//       describe: 'name',
//       demand: false,
//       alias: 'n'
//     },
//     surname: {
//       describe: 'surname',
//       demand: false,
//       alias: 'sn'
//     }
//   })
//   .command('buytoken', 'Buy token', {
//     telegramId: {
//       describe: 'telegram id',
//       demand: true,
//       alias: 't'
//     }
//   })
//   .command('addoffer', 'Add offer ', {
//     offerId: {
//       describe: 'offer id',
//       demand: true,
//       alias: 'oid'
//     },
//     sellerId: {
//       describe: 'seller telegram id',
//       demand: true,
//       alias: 'sid'
//     },
//     tokenId: {
//       describe: 'token id',
//       demand: true,
//       alias: 'tid'
//     },
//     price: {
//       describe: 'price',
//       demand: true,
//       alias: 'p'
//     }
//   })
//   .command('getoffers', 'list all offers', {
//   })
//   .command('acceptoffer', 'accept the offer', {
//     offerId: {
//       describe: 'offer id',
//       demand: true,
//       alias: 'oid'
//     },
//     buyerId: {
//       describe: 'buyer id',
//       demand: true,
//       alias: 'bid'
//     }
//   })
//   .help()
//   .argv;

// var command = argv._[0];

// if (command === 'addtoken') {
//   var token = tokens.addToken(argv.tokenId, argv.owner);
//   if (token) {
//     console.log('Token created');
//     tokens.logToken(token);
//   } else {
//     console.log('Token id taken');
//   }
// } else if (command === 'gettoken') {
//   var token = tokens.getToken(argv.tokenId);
//   if (token) {
//     console.log('token found');
//     tokens.logToken(token);
//   } else {
//     console.log('token not found');
//   }
// } else if (command === 'adduser') {
//   var user = users.addUser(argv.telegramId, argv.email, argv.name, argv.surname);
//   if (user) {
//     console.log('User registered');
//   } else {
//     console.log('user reg error');
//   }
// } else if (command === 'buytoken') {
//   var token = users.buyToken(argv.telegramId);
//   if (token.id) {
//     console.log(`Token with id = ${token.id} bought`);
//   } else {
//     console.log('no free tokens');
//   }
// } else if (command === 'addoffer') {
//   var offer = offers.addOffer(argv.offerId, argv.sellerId, argv.tokenId, argv.price);
//   if (offer.id) {
//     console.log(`offer created`);
//   } else {
//     console.log('something wrong');
//   }
// } else if (command === 'getoffers') {
//   var offersToLog = offers.getAll();
//   offersToLog.forEach((offer)=>offers.logOffer(offer));
// } else if (command === 'acceptoffer') {
//   var offer = offers.acceptOffer(argv.offerId, argv.buyerId);
//   if (offer.id) {
//     console.log('great purchase');
//   } else {
//     console.log('smthing wrong');
//   }
// }