// Список функций
// - получить список всех токенов +
// - добавить токен +
// - добавить токены из файла +
// - найти токен по id +
// - получить владельца токена (id токена) -
// - создать новую транзакцию для токена -


const fs = require('fs');

var fetchTokens = () => {
  try {
    var tokensString = fs.readFileSync('data/tokens.json');
    return JSON.parse(tokensString);
  } catch (e) {
    return [];
  }
};

var saveTokens = (tokens) => {
  fs.writeFileSync('data/tokens.json', JSON.stringify(tokens));
}

var addToken = (id, owner, transactions) => {
  var tokens = fetchTokens();
  var token = {
    id,
    owner: owner || "",
    transactions: []
  }

  var duplicateTokens = tokens.filter((token) => token.id === id);

  if (duplicateTokens.length === 0) {
    tokens.push(token);
    saveTokens(tokens);
    return token;
  }
}

var getAll = () => {
  return fetchTokens();
}

var getToken = (id) => {
  var tokens = fetchTokens();
  var filteredTokens = tokens.filter((token) => {
    return token.id == id;
  });

  console.log(filteredTokens);

  return filteredTokens[0];
}

var getFreeToken = () => {
  var tokens = fetchTokens();
  var token = {};
  var freeTokenFound = false;
  var tokenCounter = 0;
  while (!freeTokenFound && tokenCounter<tokens.length) {
    if (tokens[tokenCounter].owner === "") {
      token = tokens[tokenCounter];
      freeTokenFound = true;
    }
    tokenCounter++;
  }
  return token;
}

var changeOwner = (tokenId, ownerId) => {
  var tokens = fetchTokens();
  var tokenFound = false;
  var counter = 0;

  while (!tokenFound && (counter<tokens.length)) {
    if (tokens[counter].id == tokenId) {
      tokenFound = true;
      tokens[counter].owner = ownerId;
    }
    counter++;
  }

  saveTokens(tokens);
}

var logToken = (token) => {
  console.log('--');
  console.log(`id: ${token.id}`);
}

module.exports = {
  addToken,
  getAll,
  getToken,
  logToken,
  saveTokens,
  getFreeToken,
  changeOwner
}