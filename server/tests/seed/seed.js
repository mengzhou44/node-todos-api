const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const { ToDo } = require('../../models/todo');
const { User } = require('../../models/user');

var userOneId = new ObjectID();
var userTwoId = new ObjectID();
var users = [
  {
    _id: userOneId,
    email: 'mengzhou44@gmail.com',
    password: 'user1pass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({ _id: userOneId.toHexString(), access: 'auth' }, 'abc123').toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: 'sampl6@gmail.com',
    password: 'user2pass'
  }
];

var todos = [
  {
    _id: new ObjectID(),
    text: 'some th to do 1'
  },
  {
    _id: new ObjectID(),
    text: 'antoher thing to do',
    completed: true,
    completedAt: 3333
  }
];

var populateTodos = done => {
  ToDo.remove({})
    .then(() => {
      return ToDo.insertMany(todos);
    })
    .then(() => done());
};

var populateUsers = done => {
  User.remove({})
    .then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();
      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = { populateTodos, populateUsers, todos, users };
