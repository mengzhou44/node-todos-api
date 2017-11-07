const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { ToDo } = require('../models/todo');

const { app } = require('../server');

const todos = [
  {
    _id: new ObjectID(),
    text: 'some th to do 1'
  },
  {
    _id: new ObjectID(),
    text: 'antoher thing to do'
  }
];

beforeEach(done => {
  ToDo.remove({})
    .then(() => {
      return ToDo.insertMany(todos);
    })
    .then(() => done());
});

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
