const { mongoose } = require('..//server/db/mongoose');
const { User } = require('../server/models/user');

User.findById('5a00c42b89ed5d33b7c584b1')
  .then(user => {
    if (!user) {
      return console.log('User is not found!');
    }
    console.log(JSON.stringify(user, null, 4));
  })
  .catch(err => {
    console.log(err);
  });
