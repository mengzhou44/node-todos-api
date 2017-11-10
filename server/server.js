require('./config/config');
const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');

const { ObjectID } = require('mongodb');
const { mongoose } = require('./db/mongoose');
const { User } = require('./models/user');
const { ToDo } = require('./models/todo');
const { authenticate } = require('./middleware/authenticate');

const app = express();
app.use(bodyParser.json());

app.post('/todos', authenticate, async (req, res) => {
  try {
    var todo = new ToDo({
      text: req.body.text,
      _creator: req.user._id
    });
    const doc = await todo.save();
    res.send(doc);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/todos', authenticate, async (req, res) => {
  try {
    const todos = await ToDo.find({ _creator: req.user._id });
    res.status(200).send(todos);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/todos/:id', authenticate, async (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  try {
    const todo = await ToDo.findOne({
      _id: id,
      _creator: req.user._id
    });
    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send(todo);
  } catch (ex) {
    res.status(400).send(err);
  }
});

app.delete('/todos/:id', authenticate, async (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  try {
    const todo = await ToDo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });

    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send(todo);
  } catch (ex) {
    return res.status(400).send(err);
  }
});

app.patch('/todos/:id', authenticate, async (req, res) => {
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
  try {
    const todo = await ToDo.findOneAndUpdate(
      {
        _id: id,
        _creator: req.user._id
      },
      { $set: body },
      { new: true }
    );

    if (!todo) {
      throw new Error();
    }
    res.status(200).send(todo);
  } catch (ex) {
    res.status(400).send(err);
  }
});

// Users
app.post('/users', async (req, res) => {
  try {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (ex) {
    res.status(400).send(err);
  }
});

app.post('/users/login', async (req, res) => {
  try {
    var body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByCredential(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch (e) {
    res.status(400).send();
  }
});

app.get('/users/me', authenticate, (req, res) => {
  return res.status(200).send(req.user);
});

app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (exception) {
    res.status(400).send();
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is runnong on port ${process.env.PORT}`);
});

module.exports = { app };
