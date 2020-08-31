const { Router } = require('express');
const router = Router();
const path = require('path');
const { unlink } = require('fs-extra');
const { ensureAuthenticated } = require('../config/auth');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Articulos = require('../models/articulo');


const Proyectos = require('../models/proyectos');


var errors = [];

router.get('/acciones', ensureAuthenticated, async(req, res) => {
    const articulos = await Articulos.find();
    const proyectos = await Proyectos.find()


    console.log(req.user);
    res.render('acciones', {
        name: req.user.name,
        articulos,
        proyectos

    })
});
router.get('/agregarSalida', ensureAuthenticated, async(req, res) => {
    const articulo = new Proyectos();
    idproyecto = req.query.proyecto
    let cantidad = req.query.cantidad

    salidas = articulo.salidas = { "nombreArticulo": req.query.nombre, "numCantidad": cantidad, "proyecto": req.query.proyecto, "descSalida": req.query.descSalida, "registroNombre": req.user.name }
    try {
        Articulos.find({ nombre: { '$regex': req.query.nombre } }, (err, articulos) => {
            console.log("Se obtiene el articulo");
            console.log(articulos);
            articulos.forEach(function(articulosFor) {
                var oldCantidad = articulosFor.cantidad;
                if (cantidad >= oldCantidad) {
                    errors.push({ msg: 'La cantidad es mayor a la existente' });

                }
                if (errors.length > 0) {
                    res.render('acciones', {
                        errors,
                        articulos,
                        name: req.user.name

                    });

                } else {
                    var newCantidad = oldCantidad - cantidad
                    let id = articulosFor.id;
                    console.log(id);
                    console.log(newCantidad);
                    articulosFor.cantidad = newCantidad;

                    console.log("Siguiente funcion")
                    Articulos.findOne({ _id: id }, (err, articulosDB) => {
                        articulosDB.cantidad = newCantidad
                        console.log(articulo)
                        console.log('prueba')
                        console.log(salidas)
                        articulosDB.save((err) => {
                            if (err) {

                                errors.push({ msg: 'Ocurrio un error' });
                            }
                            if (errors.length > 0) {
                                res.render('acciones', {
                                    errors,
                                    articulosDB,
                                    proyectosDB,
                                    name: req.user.name

                                });
                                let errors = [];
                            } else {
                                req.flash(
                                    'success_msg',
                                    'Se actualizo correctamente'
                                );
                                res.redirect('acciones');
                            }
                        });
                    });
                }

            })

            Proyectos.find({ _id: idproyecto }, (err, proyectosDB) => {
                proyectosDB.forEach(function(proyectoFor) {

                    Proyectos.findOneAndUpdate({ _id: idproyecto }, { $push: { salidas: salidas } }, (err, proyectosDB) => {
                        console.log(proyectosDB);
                        console.log('modificacion exitosa');
                        proyectosDB.save()

                    })
                });

            })

        })

    } catch (error) {
        console.log(error);
    }
    let errors = [];
});
router.get('/agregarEntrada', ensureAuthenticated, async(req, res) => {
    let cantidad = req.query.cantidad
    try {
        Articulos.find({ nombre: { '$regex': req.query.nombre } }, (err, articulos) => {
            articulos.forEach(function(articulosFor) {
                var oldCantidad = articulosFor.cantidad;
                var newCantidad = (Number(oldCantidad) + Number(cantidad))
                let id = articulosFor.id;
                console.log(newCantidad);
                articulosFor.cantidad = newCantidad;
                console.log(articulosFor.cantidad);
                articulosFor.cantidad = newCantidad;
                Articulos.findOne({ _id: id }, (err, articulosDB) => {

                    articulosDB.cantidad = newCantidad
                    articulosDB.save((err) => {
                        if (err) {

                            errors.push({ msg: 'Ocurrio un error' });
                        }
                        if (errors.length > 0) {
                            res.render('acciones', {
                                errors,
                                articulosDB,
                                name: req.user.name

                            });

                        } else {
                            req.flash(
                                'success_msg',
                                'Se actualizo correctamente'
                            );
                            res.redirect('acciones');
                        }
                    });
                });

            })
        })


    } catch (error) {
        console.log(error);
    }
    let errors = [];
});
router.get('/file/:id', async(req, res) => {
    const { id } = req.params;
    const articulo = await Articulos.findById(id);
    res.render('vista', { articulo, name: req.user.name });
});
router.get('/delArticulo/:id', async(req, res) => {

    await Articulos.findByIdAndDelete(req.params.id);
    res.redirect('/acciones');
})

router.get('/searchArticulos', (req, res) => {
    try {
        Articulos.find({ $or: [{ nombre: { '$regex': req.query.nombre } }, { modelo: { '$regex': req.query.nombre } }] }, (err, articulos) => {
            if (articulos != null) {
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
                res.render('articulos', { articulos: articulos, name: req.user.name });
            }
        })
    } catch (error) {
        console.log(error);
    }
});
module.exports = router;