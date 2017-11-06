const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApps', (err, db) => {
  if (err) {
    return console.log('Unable to connect to mongo db server');
  }
  console.log('Connected to mongodb server.');
  /* 
  db
    .collection('Todos')
    .deleteOne({
      text: 'Eat Lunch'
    })
    .then(result => {
      console.log(`Success! ${result.result.ok}`);
    })
    .catch(err => {
      return console.log('Unable to delete documents!');
    }); */

  db
    .collection('Users')
    .findOneAndDelete({ _id: new ObjectID('5a00a2329d45d5c4400195c1') })
    .then(result => {
      console.log('Success!');
    });

  //db.close();
});
