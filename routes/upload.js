const { Router } = require('express');
const router = Router();
const path = require('path');
const { unlink } = require('fs-extra');
const { ensureAuthenticated } = require('../config/auth');


const Articulos = require('../models/articulo');
const Provedores = require('../models/provedores');


let errors = [];


router.get('/articulos', ensureAuthenticated, async(req, res) => {
    const articulos = await Articulos.find();
    const provedores = await Provedores.find();
    res.render('articulos', { articulos, provedores, name: req.user.name });

});

router.put('/file/:id/editar', (req, res) => {
    let { id } = req.params;
    let body = _.pick(req.body, ['nombre', 'modelo', 'categoria', 'cantidad', 'ubicacion', 'filename']); //FILTRAR del body, on el pick seleccionar los campos que interesan del body 
    //id 'su coleccion, new -> si no existe lo inserta, runVali-> sirve para validar todas las condiciones del modelo 
    Articulos.findOneAndUpdate({ _id: id }, body, { new: true, runValidators: true, context: 'query' }, (err, articulos) => {
        articulos.save().then(articulos => {
                req.flash(
                    'success_msg',
                    'Registro exitoso'
                );
                res.render('articulos', { articulos, name: req.user.name });
            })
            .catch(err => console.log(err));;

    });
});



router.post('/regArt', (req, res) => {
    const articulo = new Articulos();
    articulo.nombre = req.body.nombre;
    articulo.modelo = req.body.modelo;
    articulo.categoria = req.body.categoria;
    articulo.cantidad = req.body.cantidad;
    articulo.provedor = req.body.provedor;
    articulo.ubicacion = req.body.ubicacion;
    articulo.filename = req.file.filename;
    articulo.path = '/file/uploads/' + req.file.filename;
    articulo.originalname = req.file.originalname;
    articulo.mimetype = req.file.mimetype;
    articulo.size = req.file.size;

    articulo.save().then(provedor => {
            req.flash(
                'success_msg',
                'Registro exitoso'
            );
            res.redirect('articulos');
        })
        .catch(err => console.log(err));;



});

router.get('/file/:id', async(req, res) => {
    const { id } = req.params;
    const articulo = await Articulos.findById(id);
    res.render('vista', { articulo, name: req.user.name });
});

router.get('/file/:id/descargar', async(req, res, next) => {
    const { id } = req.params;
    const image = await Image.findById(id);

    var filePath = image.path;



    res.download(path.resolve('./public' +
        filePath));
});



router.get('/file/:id/delete', async(req, res) => {
    const { id } = req.params;
    const articulo = await Articulos.findByIdAndDelete(id);
    await unlink(path.resolve('./public' + articulo.path));
    res.redirect('/articulos');
});

router.get('/searchArticulos', async(req, res) => {
    try {
        const provedores = await Provedores.find();
        Articulos.find({ $or: [{ nombre: { '$regex': req.query.nombre } }, { modelo: { '$regex': req.query.nombre } }] }, (err, articulos) => {
            console.log(articulos)
            if (articulos === false) {
                errors.push({ msg: 'No se encontor ningun articulo' });

            }
            if (errors.length > 0) {
                res.render('articulos', {
                    errors,
                    articulos,
                    name: req.user.name

                });


            } else {
                console.log(articulos)
                res.render('articulos', { articulos: articulos, provedores, name: req.user.name });
            }
        })
    } catch (error) {
        console.log(error);
    }
    let errors = [];
})

module.exports = router;