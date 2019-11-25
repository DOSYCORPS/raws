const express = require('express');

const app = express();

const States = new Map();
const Views = {}; // lazy load from file
const Actions = {}; // lazy load from file


app.get(':view', async (req, res) => {
  
});

app.post(':action', async (req, res) => {

});


// lazily get and cache view function
async function getView(name) {

}

// lazily get and cache action function
async function getAction(name) {

}
