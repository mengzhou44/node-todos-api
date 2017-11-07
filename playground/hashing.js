const { SHA256 } = require('crypto-js');
const bcrypt = require('bcryptjs');

var password = '1234!';
/* bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
}); */

const hashed = '$2a$10$sGsCV5Ru.1/7Yt8YN4miEeVXyGZDZ6B6ZG2ufiPmKjNWQDdhrtdui';

bcrypt.compare(password, hashed, (err, result) => {
  console.log('result ' + result);
});
/* 
const message = 'Hi, I am a message!';
const hash = SHA256(message).toString();

console.log(`message: ${message}`);
console.log(`hash: ${hash}`);

var data = {
  id: 4
};

var token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'secretmessage').toString()
};

token.data.id = 6;

var resultHash = SHA256(JSON.stringify(token.data) + 'secretmessage').toString();

if (resultHash === token.hash) {
  console.log('Data is not modified!');
} else {
  console.log('Warning! Data is  modified!');
} */
