
exports.up = function(knex, Promise) {
  return knex.schema.createTable('asistentes', (t) => {
    t.increments('id').primary();
    t.string('nombre');
    t.string('apellido');
    t.string('ocupacion');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('asistentes');
};
