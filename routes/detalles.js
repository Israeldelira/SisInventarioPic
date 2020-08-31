const { Router } = require('express');
const router = Router();
const path = require('path');
const { unlink } = require('fs-extra');
const { ensureAuthenticated } = require('../config/auth');


const Articulos = require('../models/articulo');
const Proyectos = require('../models/proyectos');


let errors = [];


router.get('/detallesProyecto', ensureAuthenticated, async(req, res) => {
    const articulos = await Articulos.find();
    const proyectos = await Proyectos.find();
    res.render('detallesProyecto', { articulos, proyectos, name: req.user.name });

});
// router.get('/file/:id/delete', async(req, res) => {
//     const { id } = req.params;
//     const articulo = await Proyectos.findByIdAndDelete(id);
//     await unlink(path.resolve('./public' + articulo.path));
//     res.redirect('/articulos');
// });

// router.get('/detallesProyecto/:id/obtener', ensureAuthenticated, async(req, res) => {
//     let { id } = req.params;
//     const articulos = await Articulos.find();
//     const proyectos = await Proyectos.findById(id);
//     console.log(proyectos)
//     res.render('detallesProyecto', { articulos, proyectos, name: req.user.name });

// });

// router.put('/file/:id/editar', (req, res) => {
//     let { id } = req.params;
//     let body = _.pick(req.body, ['nombre', 'modelo', 'categoria', 'cantidad', 'ubicacion', 'filename']); //FILTRAR del body, on el pick seleccionar los campos que interesan del body 
//     //id 'su coleccion, new -> si no existe lo inserta, runVali-> sirve para validar todas las condiciones del modelo 
//     Articulos.findOneAndUpdate({ _id: id }, body, { new: true, runValidators: true, context: 'query' }, (err, articulos) => {
//         articulos.save().then(articulos => {
//                 req.flash(
//                     'success_msg',
//                     'Registro exitoso'
//                 );
//                 res.render('articulos', { articulos, name: req.user.name });
//             })
//             .catch(err => console.log(err));;

//     });
// });




router.get('/file/:id/:id2/deleteProyecto', async(req, res) => {
    const { id } = req.params;
    const { id2 } = req.params;
    console.log("verificacion");
    console.log(id);
    console.log(id2);
    Proyectos.findOneAndUpdate({ _id: id }, { $pull: { "salidas": { _id: id2 } } }, { safe: true, upsert: true }, (err, proyectos) => {
        console.log("si entrra")
        console.log(proyectos)
        proyectos.save((err) => {
            if (proyectos === false) {
                errors.push({ msg: 'No se encontor ningun proyecto' });

            }
            if (errors.length > 0) {
                res.render('detallesProyecto', {
                    errors,
                    proyectos,
                    name: req.user.name

                });

            } else {


                console.log(proyectos)
                res.redirect('/detallesProyecto');
            }
        })
    })
})

router.get('/searchdetallesProyecto', (req, res) => {
    try {
        Proyectos.find({ nombreProyecto: { '$regex': req.query.nombre } }, (err, proyectos) => {
            if (proyectos === false) {
                errors.push({ msg: 'No se encontor ningun proyecto' });

            }
            if (errors.length > 0) {
                res.render('detallesProyecto', {
                    errors,
                    proyectos,
                    name: req.user.name

                });

            } else {


                console.log(proyectos)
                res.render('detallesProyecto', { proyectos: proyectos, name: req.user.name });
            }
        })
    } catch (error) {
        console.log(error);
    }
    let errors = [];
});


module.exports = router;