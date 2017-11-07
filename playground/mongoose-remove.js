const { mongoose } = require('../server/db/mongoose');
const { ToDo } = require('../server/models/todo');

ToDo.findByIdAndRemove('5a00f6f616491f3a9dee6920').then(todo => {
  console.log(JSON.stringify(todo, null, 4));
});
