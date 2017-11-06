const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const { mongoose } = require('./db/mongoose');
const { User } = require('./models/user');
const { ToDo } = require('./models/todo');

const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new ToDo({
    text: req.body.text
  });
  todo
    .save()
    .then(doc => {
      res.send(doc);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
  ToDo.find()
    .then(todos => {
      res.status(200).send(todos);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  ToDo.findById(req.params.id)
    .then(todo => {
      if (!todo) {
        res.status(400).send('To do record is not found!');
      }
      res.status(200).send(todo);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

app.get('/', (req, res) => {
  res.send('Easy Express Solutions Inc.');
});

app.listen(port, () => {
  console.log(`Server is runnong on port ${port}`);
});

module.exports = { app };
