const { SHA256 } = require('crypto-js');

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
}
