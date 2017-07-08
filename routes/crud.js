var express = require('express');
var router = express.Router();
var bookshelf = require('../bookshelf');
var knex = bookshelf.knex;
var Asistente = require('../models/asistentes');

router.get('/nuevo', function(req, res, next) {
  res.render('CRUD_views/nuevo', {
    titulo: 'Taller de node.js',
    saludo: 'Hola desde node yey!'
  });
});

router.post('/guardar', function(req, res, next) {
  new Asistente().save(req.body).then(model => {
    if (req.xhr) {
      res.json(model.toJSON()); 
    } else {
      res.redirect('/crud/lista');
    }
  });
});

router.get('/lista', function(req, res, next) {
  new Asistente().fetchAll({ withRelated: ['habilidades'] }).then(model => {
    /* res.render('CRUD_views/lista', {
      titulo: 'Lista de asistentes',
      asistentes: model.toJSON()
    })*/
    res.json(model.toJSON());
  })
})

router.delete('/eliminar/:id', function(req, res, next) {
  new Asistente({ id: req.params.id }).destroy().then(model => {
    res.json({ deleted: true });
  }).catch(err => {
    res.json({ deleted: false });
  })
})

router.get('/editar', function(req, res, next) {
  new Asistente({ id: req.params.id }).fetch().then(model => {
    res.render('CRUD_views/editar', {
      titulo: 'Editar asistente',
      asistente: model.toJSON()
    })
  })
})

router.post('/editar', function(req, res, next) {
  // new Asistente({ id: req.body.id }).save({ nombre: req.body.nombre })
  new Asistente(req.body).save().then(model => {
    if (req.xhr) {
      res.json(model.toJSON());
    } else {
      res.redirect('/crud/lista');
    }
  })
})

module.exports = router;
