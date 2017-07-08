let bookshelf = require('../bookshelf');
let Habilidades = require('./habilidades');

module.exports = bookshelf.Model.extend({
  tableName: 'asistentes',
  habilidades: function() {
    return this.hasMany(Habilidades);
  }
});