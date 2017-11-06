const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApps', (err, db) => {
  if (err) {
    return console.log('Unable to connect to mongo db server');
  }
  console.log('Connected to mongodb server.');

  /*   db
    .collection('Todos')
    .findOneAndUpdate(
      { _id: new ObjectID('5a009065687e6430f10facf3') },
      { $set: { completed: true } },
      { returnOriginal: false }
    )
    .then(result => {
      console.log(JSON.stringify(result, null, 4));
    }); */

  db
    .collection('Users')
    .findOneAndUpdate(
      {
        _id: new ObjectID('5a00921ac2003330f95c4212')
      },
      {
        $set: { name: 'mark' },
        $inc: { age: 1 }
      },
      {
        returnOriginal: false
      }
    )
    .then(result => {
      console.log(JSON.stringify(result, null, 4));
    });

  //db.close();
});
