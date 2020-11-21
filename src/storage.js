const Store = require('electron-store');
const defaults = require('./default-config.json')
const store = new Store({ defaults });

module.exports = store;