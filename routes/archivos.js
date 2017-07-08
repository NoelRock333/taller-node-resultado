var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: 'temporal/' });
var fs = require('fs');
var path = require('path');
var papaparse = require('papaparse');
var async = require('async');
var Asistente = require('../models/asistentes');

/* GET home page. */
router.get('/subir', function(req, res, next) {
  res.render('archivos/subir', { titulo: 'Subir archivos' });
});

router.post('/cargar', upload.single('miarchivo'), function(req, res, next) {
  var fileObj = req.file;
  if (fileObj) {
    var source = fs.createReadStream(`./${fileObj.destination}${fileObj.filename}`);
    var dest = fs.createWriteStream(`./archivos_publicos/${fileObj.originalname}`);
    source.pipe(dest);
    source.on('end', () => {
      if (path.extname(fileObj.originalname).toLocaleLowerCase() == '.csv') {
        fs.readFile(`./archivos_publicos/${fileObj.originalname}`, 'utf8', (err, data) => {
          if (!err) {
            papaparse.parse(data, {
              header: true,
              comments: false,
              complete: function(results) {
                async.eachSeries(results.data, function iterate(item, callback) {
                  new Asistente().save({
                    nombre: item.Nombre,
                    ocupacion: item.Grado
                  }).then(model => {
                    if (model.get('id')) {
                      callback(null);
                    } else {
                      callback({ error: 'No se pudo insertar un registro'})
                    }
                  })
                }, function done(err) {
                  if (err) return console.log(err);
                  res.send('Ha finalizado el proceso de insersion');
                })
              }
            })
          }
        })
      }
      /* res.render('archivos/subir', {
        cargado: true,
        nombre_de_archivo: fileObj.originalname,
        titulo: 'Subir archivos'
      }); */
    });

    source.on('error', (err) => {
      console.log(err);
    });

    source.on('close', () => {
      fs.unlink(`./${fileObj.destination}${fileObj.filename}`, () => {
        console.log('Archivo eliminado')
      })
    });
  }
});

module.exports = router;
