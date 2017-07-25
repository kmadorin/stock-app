
// - Модуль для работы с пользователями
//  - регистрация на бирже (ник, почта, имя, фамилия)
//    - добавление в базу пользователей +
//    - подтянуть список токенов, которыми владеет этот пользователь из базы данных токенов
//  - покупка токена у биржи
//  - заявка на продажу
//  - отозвать заявку на продажу
//  - получить список своих предложений
//  - получить список всех предложений кроме своих
//  - покупка токена из списка предложений
//  - просмотр списка токенов во владении

const fs = require('fs');
const tokensModule = require('./tokens');

var fetchUsers = () => {
  try {
    var usersString = fs.readFileSync('data/users.json');
    return JSON.parse(usersString);
  } catch (e) {
    return [];
  }
};

var saveUsers = (users) => {
  fs.writeFileSync('data/users.json', JSON.stringify(users));
}

var addUser = (id, email, name, surname) => {
  var users = fetchUsers();

  var user = {
    id,
    email,
    name: name || "",
    surname: surname || "",
    tokens: []
  }

  var duplicateUsers = users.filter((user) => user.id === id);
  if (duplicateUsers.length === 0) {
    //search for tokens user bought
    var tokens = tokensModule.getAll();
    tokens.forEach((token)=>{
      if (token.owner === user.id) {
        user.tokens.push(token);
      }
    });
    users.push(user);
    saveUsers(users);
    return user;
  }
}

var getAll = () => {
  return fetchUsers();
}

var getUser = (id) => {
  var users = fetchUsers();
  var filteredUsers = users.filter((user) => user.id === id);
  return filteredNotes[0];
}

var buyToken = (userId) => {
  var users = fetchUsers();
  var tokens = tokensModule.getAll();
  var user = users.filter((user)=>user.id === userId)[0];

  var tokenToBuy = tokensModule.getFreeToken();
  if (user && tokenToBuy.id) {
    user.tokens.push(tokenToBuy);
    tokenToBuy.owner = userId;
    saveUsers(users);
    tokens.filter((token)=>token.id===tokenToBuy.id)[0].owner = userId;
    tokensModule.saveTokens(tokens);
  }
  return tokenToBuy;
}



module.exports = {
  addUser,
  getUser,
  buyToken,
  getAll
}

