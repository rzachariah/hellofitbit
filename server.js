var config = require('./config/app')
  , express = require('express')
  , app = express()
  , FitbitClient = require('fitbit-client-oauth2')
  , consumerKey = process.env.CONSUMER_KEY || config.CONSUMER_KEY
  , consumerSecret = process.env.CONSUMER_SECRET || config.CONSUMER_SECRET
  , client = new FitbitClient(consumerKey, consumerSecret)
  , redirect_uri = 'http://fitness.ranjithzachariah.com/oauth2/callback'
  , scope = ['activity', 'nutrition', 'profile', 'settings', 'sleep', 'social', 'weight']
  , port = process.env.PORT || 3000;

var tokens;

var options = { /* TIME_SERIES_OPTIONS */ };

// Logging
app.use(function (req, res, next) {
  console.log('%s %s', req.method, req.url);
  next();
});

app.get('/health', function (req, res) {
  res.status(200).send('OK');
});

// OAuth flow
app.get('/', function (req, res) {
  console.log('Begin OAuth flow.')
  var authorization_uri = client.getAuthorizationUrl(redirect_uri, scope);
  console.log(`auth uri ${authorization_uri}`);
  res.redirect(authorization_uri);
});

// On return from the authorization
app.get('/oauth2/callback', function (req, res, next) {
  console.log('In callback')
  var code = req.query.code;
  console.log('code', code);
  client.getToken(code, redirect_uri)
    .then(function (token) {
      console.log('token', token);
      tokens = token;

      // then redirect
      res.redirect(302, '/stats');

    })
    .catch(function (err) {
      // something went wrong.
      res.send(500, err);

    });

});

// Display some stats
app.get('/stats', function (req, res) {
  client.getTimeSeries(tokens, options)
    .then(function (data) {
      console.log('data: ', data);
      res.send(data);
    }).catch(function (err) {
      console.log('error getting user data', err);
    });
});

// Start express 
app.listen(port, function () {
  console.log(`server started on localhost:${port}`);
});