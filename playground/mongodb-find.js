const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApps', (err, db) => {
  if (err) {
    return console.log('Unable to connect to mongo db server');
  }
  console.log('Connected to mongodb server.');

  db
    .collection('Todos')
    .find({ _id: new ObjectID('5a009065687e6430f10facf3') })
    .toArray()
    .then(docs => {
      console.log(JSON.stringify(docs, null, 4));
    })
    .catch(err => {
      console.log('Unable to fetch to do list.', err);
    });

  db
    .collection('Todos')
    .find()
    .count()
    .then(count => {
      console.log(`Toatal todo items ${count}`);
    })
    .catch(err => {
      console.log('Unable to get todo count', err);
    });

  db.close();
});
