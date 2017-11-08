const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { ToDo } = require('../models/todo');
const { app } = require('../server');
const { todos, users, populateTodos, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('GET /todos', () => {
  it('should get a todo list', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(2);
        expect(res.body[0].text).toBe('some th to do 1');
      })
      .end(done);
  });
});

describe('POST /todos', () => {
  it('should not create todo with invalid body text', done => {
    request(app)
      .post('/todos')
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
      .expect(404)
      .end(done);
  });

  it('should get 404 for not found', done => {
    var id = new ObjectID();
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('should get todo item by id', done => {
    var id = todos[0]._id.toHexString();

    request(app)
      .get(`/todos/${id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(todos[0].text);
      })
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('shoud remove a todo item', done => {
    var id = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
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
      .expect(404)
      .end(done);
  });

  it('shoud return 404 if todo is not found', done => {
    var id = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${id}`)
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
