require('./config');
const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const { mongoose } = require('./db/mongoose');
const { User } = require('./models/user');
const { ToDo } = require('./models/todo');

const app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  console.log(req.body.text);
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
        res.status(404).send();
      }
      res.status(200).send(todo);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  ToDo.findByIdAndRemove(id)
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.status(200).send(todo);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  var body = _.pick(req.body, ['text', 'completed']);

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  console.log('body', body);

  ToDo.findByIdAndUpdate(
    id,
    {
      $set: body
    },
    {
      new: true
    }
  )
    .then(todo => {
      res.status(200).send(todo);
    })
    .catch(err => res.status(400).send(err));
});

app.get('/', (req, res) => {
  res.send('Easy Express Solutions Inc.');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is runnong on port ${process.env.PORT}`);
});

module.exports = { app };
