exports.up = function(knex, Promise) {
  return knex.schema.createTable('habilidades', (t)=> {
    t.increments('id').primary();
    t.integer('asistente_id').references('asistentes.id').unsigned();
    t.string('habilidad');
  });
};

exports.down = function(knex, Promise) {
  // Se tienen que eliminar en orden, primero la que tiene las relaciones y luego la relacionada
  return knex.schema
    .dropTableIfExists('habilidades')
};