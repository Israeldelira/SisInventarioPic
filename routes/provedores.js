const { Router } = require('express');
const router = Router();
const path = require('path');
const { unlink } = require('fs-extra');
const { ensureAuthenticated } = require('../config/auth');


const Provedores = require('../models/provedores');

let errors = [];

router.get('/provedores', ensureAuthenticated, async(req, res) => {
    const provedores = await Provedores.find().sort({ _id: 1 }).limit(8);
    console.log(req.user);
    res.render('provedores', {
        name: req.user.name,
        provedores
    })



});

router.post('/regProvedor', (req, res) => {
    const provedor = new Provedores();
    provedor.nombreProv = req.body.provedor;
    provedor.direccion = req.body.direccion;
    provedor.telefono = req.body.telefono;
    provedor.save().then(provedor => {
            req.flash(
                'success_msg',
                'Registro exitoso'
            );
            res.redirect('provedores');
        })
        .catch(err => console.log(err));;


});
router.get('/delProvedor/:id', async(req, res) => {

    await Provedores.findByIdAndDelete(req.params.id);
    res.redirect('/provedores');
})
router.get('/searchProvedor', (req, res) => {
    try {
        Provedores.find({ $or: [{ nombreProv: { '$regex': req.query.nombre } }, { direccion: { '$regex': req.query.nombre } }] }, (err, provedores) => {
            if (provedores === false) {
                errors.push({ msg: 'No se encontor ningun provedor' });

            }
            if (errors.length > 0) {
                res.render('provedores', {
                    errors,
                    provedores,
                    name: req.user.name

                });

            } else {


                console.log(provedores)
                res.render('provedores', { provedores: provedores, name: req.user.name });
            }
        })
    } catch (error) {
        console.log(error);
    }
    let errors = [];
});

module.exports = router;