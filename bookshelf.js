var knexFile = require('./knexfile');
function knexEnv() {
  if (process.env.NODE_ENV) {
    return knexFile[process.env.NODE_ENV];
  } else {
    return knexFile.development;
  }
}
var knex = require('knex')(knexEnv());

var bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;