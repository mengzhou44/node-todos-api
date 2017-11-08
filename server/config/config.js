const env = process.env.NODE_ENV || 'development';

if (env !== 'production') {
  const config = require('./config.json');
  const envConfig = config[env];

  var keys = Object.keys(envConfig);

  keys.forEach(key => {
    process.env[key] = envConfig[key];
  });
}

console.log(`ENV ********** ${env}`);
