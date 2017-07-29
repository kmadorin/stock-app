const botToken = "385718733:AAEE4droBjdFhMtL4X-yFI7HSDYPzg8GIoI";

var TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const tokensModule = require('./tokens');
const usersModule = require('./users');
const offersModule = require('./offers');


var TelegramBot = require('node-telegram-bot-api'),
// Be sure to replace YOUR_BOT_TOKEN with your actual bot token on this line.
telegram = new TelegramBot(botToken, { polling: true });

telegram.on("text", (message) => {
  if(message.text.toLowerCase().indexOf("/start") === 0){
    var id = "@"+ message.from.username;

    var user = usersModule.addUser(id);
    telegram.sendMessage(message.chat.id, "Вы добавлены на биржу");
  }

  if(message.text.toLowerCase().indexOf("/mytokens") === 0){
    var id = "@"+ message.from.username;

    var tokens = usersModule.getTokensByUserId(id);

    var response = "";

    if (tokens.length === 0) {
      response = "У вас пока нет ни одного токена";
    } else {
      response = "Ваши токены: \n";
      response+= JSON.stringify(tokens, undefined, 2);
    }

    telegram.sendMessage(message.chat.id, response);
  }

  if (message.text.toLowerCase().indexOf("/addtoken") === 0) {
    var id = "@"+ message.from.username;

    var token = usersModule.buyToken(id);

    if (token) {
      telegram.sendMessage(message.chat.id, `Куплен билет #1`);
    } else {
      telegram.sendMessage(message.chat.id, `ошибка покупки`);
    }
  }

  if (message.text.toLowerCase().indexOf("/buy") === 0) {
    // var offersListing = offersModule.getAll();
    telegram.sendMessage(message.chat.id, 'Где вы хотите купить билет?', {
      "reply_markup": {
        "inline_keyboard": [[{"text": "На бирже", "callback_data": JSON.stringify({type: 'stock'})}]]
      }
    });
  }
});

// Matches "/sell [price]"
telegram.onText(/\/sell (.+)/, (message, match) => {
  var seller = "@"+ message.from.username;
  var response = "";
  var sellerTokens = usersModule.getTokensByUserId(seller);
  var price = match[1];
  if (sellerTokens.length!==0) {
    var token = sellerTokens[0];
  } else {
    response = "У вас нет токенов для продажи";
  }

  var offer = offersModule.addOffer(seller, token.id, price);

  if (offer.id) {
    response = "Ваше предложение добавлено на биржу";
  } else {
    response = "Предложение с таким токеном уже существует";
  }

  telegram.sendMessage(message.chat.id, response);
});

telegram.on('callback_query', (res)=>{

  var data = JSON.parse(res.data);
  if (data.type === "stock") {
    var offers = offersModule.getAll().map(function(offer){
      return [{text: offer.price+"$", "callback_data": JSON.stringify({type: "offer", offer: offer.id})}]
    });
    telegram.sendMessage(res.message.chat.id, "Список предложений на бирже:", {
      "reply_markup": {
        "inline_keyboard": offers
      }
    });
  }

  if (data.type === "offer" ) {

    var offer = offersModule.getOfferById(data.offer);
    if (offer) {
      telegram.sendMessage(res.message.chat.id, `Вы оставили заявку на оффер пользователя ${offer.seller}`, {
        "reply_markup": {
          "inline_keyboard": [[{text: `Купить за ${offer.price}`, pay: true, "callback_data": JSON.stringify({type: "selling"})}]]
        }
      });
    } else {
      telegram.sendMessage(res.message.chat.id, 'Оффер не найден');
    }
  }
});