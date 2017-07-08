let bookshelf = require('../bookshelf');
let Asistente = require('./asistentes');

module.exports = bookshelf.Model.extend({
  tableName: 'habilidades',
  asistente: function() {
    return this.belongsTo(Asistente);
  }
});