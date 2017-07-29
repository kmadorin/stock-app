// Список функций для работы с предложениями:

// - принять предложение на продажу (id пользователя, id токена)
// - получить список всех предложений
// - удалить предложение из списка предложений
// - поиск предложений
//   - по id
//   - по продавцу


const fs = require('fs');
const {ObjectId} = require('mongodb');

const usersModule = require('./users');
const tokensModule = require('./tokens');

var fetchOffers = () => {
  try {
    var offersString = fs.readFileSync('data/offers.json');
    return JSON.parse(offersString);
  } catch (e) {
    return [];
  }
};

var saveOffers = (offers) => {
  fs.writeFileSync('data/offers.json', JSON.stringify(offers));
}

var addOffer = (sellerId, tokenId, price) => {
  //check if user owns this token

  var users = usersModule.getAll();

  var seller = users.filter((user)=>{
    var hastoken = false;
    var counter = 0;
    while (!hastoken && (counter<user.tokens.length)) {
      if (user.tokens[counter].id == tokenId) {
        hastoken = true;
      }
      counter++;
    }
    return hastoken;
  })[0];

  if (seller) {
    var offers = fetchOffers();
    var id = new ObjectId();
    var offer = {
      id: id,
      seller: sellerId,
      token: tokenId,
      price
    }



    var duplicateOffers = offers.filter((offer) => offer.token === tokenId);
    console.log(duplicateOffers);
    if (duplicateOffers.length === 0) {
      offers.push(offer);
      saveOffers(offers);

      return offer;
    } else {
      return {}
    }

  } else {
    return {}
  }

}

var getAll = () => {
  return fetchOffers();
}

var getOfferById = (id) => {
  var offers = fetchOffers();
  var filteredOffers = offers.filter((offer) => offer.id === id);
  return filteredOffers[0];
}

var getOffersBySeller = (seller) => {
  var offers = fetchOffers();
  var filteredOffers = offers.filter((offer) => offer.seller === seller);
  return filteredOffers;
}

var removeOffer = (id) => {
  var offers = fetchOffers();
  var offersLeft = offers.filter((offer) => offer.id !== id)
  saveOffers(offersLeft);

  if (offers.length!==offersLeft.length) {
    return true
  } else {
    return false
  }
}

var logOffer = (offer) => {
  console.log(`offer: ${offer.id}`);
  console.log('--');
  console.log(`user: ${offer.seller}`);
  console.log(`price: ${offer.price}`);
}

var acceptOffer = (offerId, buyerId) => {
  var offers = fetchOffers();
  var offer = offers.filter((offer) => offer.id == offerId)[0];

  if (offer) {

    //make new transaction and add to
    //the list of transactions for the token
    var tokens = tokensModule.getAll();

    var token = tokens.filter((token)=>token.id == offer.token)[0];

    token.transactions.push({
      seller: offer.seller,
      buyer: buyerId,
      hash: ''+buyerId+' '+ offer.seller
    });
    tokensModule.saveTokens(tokens);
    //change owner of the token
    tokensModule.changeOwner(offer.token, buyerId);

    //remove the offer from list
    var offersLeft = offers.filter((offer) => offer.id != offerId);
    saveOffers(offersLeft);
    return offer;
  } else {
    return {}
  }
}

module.exports = {
  addOffer,
  getAll,
  getOfferById,
  getOffersBySeller,
  removeOffer,
  logOffer,
  acceptOffer
}
