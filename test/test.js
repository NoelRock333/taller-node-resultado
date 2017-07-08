process.env.NODE_ENV = 'test';
var assert = require('assert');
var request = require('supertest');
var knex = require('../bookshelf').knex;
var app = require('../app.js');
var should = require('should');
var async = require('async');

describe('Regresa un numero', function() {
  describe('Checar numero correcto', () => {
    it('Debe regresar el numero correcto', () => {
      assert.equal(2, 2);
    });
  })
});

describe('CRUD', () => {
  beforeEach((done) => {
    knex('habilidades').del().then(() => {
      knex('asistentes').del().then(() => {
        done();
      })
    })
    /* knex('asistentes').truncate().then(() => {
      done();
    })*/
  });

  after((done) => {
    knex('habilidades').del().then(() => {
      knex('asistentes').del().then(() => {
        done();
      })
    })
  });

  it('Insersion', (done) => {
    request(app)
      .post('/crud/guardar')
      .set('X-Requested-With', 'XMLHttpRequest')
      //.set('Autentication', 'Barrer usuario:password')
      .send({
        nombre: 'Noel',
        apellido: 'Escobedo',
        ocupacion: 'Desarrollador'
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('nombre');
        res.body.should.have.property('id');
        done();
      })
  });

  it('Edicion de asistente', (done) => {
    async.waterfall([
      function (callback) {
        knex('asistentes').insert({
          nombre: 'Noel',
          apellido: 'Solorzano',
          ocupacion: 'Desarrollador'
        }).then(data => {
          callback(null, { id: data.pop() })
        });
      },
      function (arg1, callback) {
        request(app)
          .post('/crud/editar')
          .set('X-Requested-With', 'XMLHttpRequest')
          .send({
            id: arg1.id,
            nombre: 'Alejandro',
            apellido: 'Escobedo'
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end(callback)
      }
    ],function(err, res) {
      if (err) return done(err);
      (res.body.nombre).should.be.equal('Alejandro');
      (res.body.apellido).should.be.equal('Escobedo');
      done();
    })
  });
});