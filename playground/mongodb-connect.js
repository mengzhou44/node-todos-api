const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApps', (err, db) => {
  if (err) {
    return console.log('Unable to connect to mongo db server');
  }
  console.log('Connected to mongodb server.');
  /*   db.collection('Todos').insertOne({
    text: 'some task to do',
    completed: false
  },
  (err, result) => {
    if (err) {
      return console.log('unable to insert a todo document.', err);
    }
    console.log(JSON.stringify(result.ops, null, 2));
  }); */

  db.collection('Users').insertOne({
    name: 'daniel',
    age: 44,
    location: 'calgary'
  },
  (err, result) => {
    if (err) {
      return console.log('Unable to insert a users document', err);
    }
    console.log(JSON.stringify(result.ops, null, 2));
  });

  db.close();
});
