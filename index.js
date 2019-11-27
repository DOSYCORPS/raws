const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const app = express();

const COOKIE_NAME = 'whitewater-raws-brownie';
const PORT = process.argv[2] || process.env.PORT || 8080;
const BASE = 1111;
const MODULUS = 111*2047**3;

const States = new Map();
const Views = {}; // lazy load from file
const Actions = {}; // lazy load from file
const Server = {};

app.use(helmet());
app.use(cookieParser());
app.use(session);
app.use(express.urlencoded({extended:true}));
app.use(express.json({extended:true}));

app.get('/', wrap(async (req, res) => {
  const viewFunc = await getView('root');
  const {State} = req;
  const view = viewFunc(State);
  console.log(viewFunc, State, view);
  res.type('html');
  res.end(view);
}));

app.get('/view/:view', wrap(async (req, res) => {
  console.log('view');
  res.end("OK");
}));

app.post('/act/:action', wrap(async (req, res) => {

}));

app.use(express.static('public'));

app.use(errors);

app.listen(PORT, (err) => {
  if ( err ) {
    throw err;
  }
  Object.assign(Server, {
    port: PORT,
    up_at: new Date
  });
  say({Server});
});


// lazily get and cache view function
async function getView(name) {
  return () => `<h1>HI</h1>`;
}

// lazily get and cache action function
async function getAction(name) {
  return x => clone(x);
}

async function session(req, res, next) {
  let cookie = req.cookies[COOKIE_NAME];
  if ( ! cookie ) {
    cookie = randomName();
    res.cookie(COOKIE_NAME, cookie, {httpOnly:true, sameSite:true});
    States.set(cookie, new BlankState);
  }
  const State = States.get(cookie);
  if ( ! State ) {
    res.clearCookie(COOKIE_NAME);
    next(new Error(`Permission denied`));
  }
  req.State = State;
  next();
}

function say(o) {
  console.log(JSON.stringify(o));
}

function randomName() {
  return (((+ new Date)*Math.random()*BASE)%MODULUS).toString(36);
}

function errors(err, req, res, next) {
  say({err:err+''});
  res.status(500).send("Error");
}

function BlankState() {
  this.name = 'unknown';
}

function wrap(h) {
  return function f(...args) {
    h(...args).catch(args.pop());
  };
}

function clone(o) {
  return JSON.parse(JSON.stringify(o));
}

