const { Router } = require('express');
const router = Router();
const path = require('path');
const { unlink } = require('fs-extra');
const { ensureAuthenticated } = require('../config/auth');

const Proyectos = require('../models/proyectos');
const Articulo = require('../models/articulo');


let errors = [];

router.get('/proyectos', ensureAuthenticated, async(req, res) => {

    const proyectos = await Proyectos.find()

    console.log(req.user);
    res.render('proyectos', {
        name: req.user.name,
        proyectos,

    })
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
                res.render('proyectos', { articulos, name: req.user.name });
            })
            .catch(err => console.log(err));;

    });
});



router.post('/regProyecto', (req, res) => {
    const proyecto = new Proyectos();
    proyecto.nombreProyecto = req.body.nombreProyecto;

    proyecto.empresa = req.body.empresa;
    proyecto.filename = req.file.filename;
    proyecto.path = '/file/uploads/' + req.file.filename;
    proyecto.originalname = req.file.originalname;
    proyecto.mimetype = req.file.mimetype;
    proyecto.size = req.file.size;

    proyecto.save().then(proyecto => {
            req.flash(
                'success_msg',
                'Registro exitoso'
            );
            res.redirect('proyectos');
        })
        .catch(err => console.log(err));;



});

router.get('/file/:id/delProyecto', async(req, res) => {
    const { id } = req.params;
    const articulo = await Articulos.findByIdAndDelete(id);
    await unlink(path.resolve('./public' + articulo.path));
    res.redirect('/proyectos');
});

router.get('/searchProyectos', (req, res) => {
    try {
        Articulos.find({ $or: [{ nombreProyecto: { '$regex': req.query.nombreProyecto } }, { empresa: { '$regex': req.query.empresa } }] }, (err, proyecto) => {
            console.log(proyecto)
            if (proyecto === false) {
                errors.push({ msg: 'No se encontor ningun proyecto' });

            }
            if (errors.length > 0) {
                res.render('proyectos', {
                    errors,
                    proyecto,
                    name: req.user.name

                });


            } else {
                console.log(proyecto)
                res.render('proyectos', { proyecto: proyecto, name: req.user.name });
            }
        })
    } catch (error) {
        console.log(error);
    }
    let errors = [];
});






module.exports = router;