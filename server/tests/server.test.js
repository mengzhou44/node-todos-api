const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { ToDo } = require('../models/todo');
const { User } = require('../models/user');
const { app } = require('../server');
const { todos, users, populateTodos, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('GET /todos', () => {
  it('should get a todo list', done => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(1);
        expect(res.body[0].text).toBe(todos[0].text);
      })
      .end(done);
  });
});

describe('POST /todos', () => {
  it('should not create todo with invalid body text', done => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({ text: '' })
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        ToDo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should create a todo', done => {
    var text = 'test todo text';
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        ToDo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe('GET /todos/:id', () => {
  it('should get 404 for invalid id', done => {
    request(app)
      .get('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should get 404 for not found', done => {
    var id = new ObjectID();
    request(app)
      .get(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return todo doc', done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should  not get todo item by other user', done => {
    var id = todos[0]._id.toHexString();

    request(app)
      .get(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('shoud remove a todo item', done => {
    var id = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(todos[0].text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        ToDo.findById(id)
          .then(todo => {
            expect(todo).toNotExist();
            done();
          })
          .catch(err => done(err));
      });
  });

  it('shoud return 404 if id is invalid', done => {
    request(app)
      .delete(`/todos/123`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('shoud return 404 if todo is not found', done => {
    var id = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH  /todos/:id', () => {
  it('should update an item', done => {
    var id = todos[0]._id.toHexString();
    var newText = 'this is new text';
    var completedAt = 3423;

    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        text: newText,
        completed: true,
        complatedAt: completedAt
      })
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(id);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        ToDo.findById(id)
          .then(todo => {
            expect(todo.text).toBe(newText);
            expect(todo.completed).toBeTruthy();
            expect(todo.completedAt).toBeA('number');
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should clear completed when a todo item is not compeleted', done => {
    var id = todos[1]._id.toHexString();

    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: false
      })
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(id);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        ToDo.findById(id)
          .then(todo => {
            expect(todo.completed).toBeFalsy();
            expect(todo.completedAt).toNotExist();
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .send(users[0])
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', done => {
    request(app)
      .get('/users/me')
      .send(users[1])
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});
describe('POST /users/login', () => {
  it('should login user and return auth token', done => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens[1]).toInclude({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should reject invalid login', done => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + 'avs'
      })
      .expect(400)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('DELETE  /users/me/token', () => {
  it('should remove token', done => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[0]._id)
          .then(user => {
            if (!user) {
              return done('user is not found!');
            }
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(e => done(e));
      });
  });
});
