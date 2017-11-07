const env = process.env.NODE_ENV || 'development';

if (env !== 'production') {
  process.env.PORT = 3000;

  if (env === 'development') {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
  } else if (env === 'test') {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
  }
}

console.log(`ENV ********** ${env}`);

console.log(process.env.MONGODB_URI);
