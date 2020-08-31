const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Articulos = require('../models/articulo');
let errors = []
router.get('/index', ensureAuthenticated, (req, res) => {
    try {
        Articulos.find({ "cantidad": { $lt: 6 } }, (err, articulos) => {
            console.log(articulos)
            if (articulos != null) {
                errors.push({ msg: 'No se requiere llenar stock' });

            }
            if (errors.length > 0) {
                res.render('index', {
                    errors,
                    articulos,
                    name: req.user.name

                });
            } else {


                console.log(articulos)
                res.render('index', { articulos: articulos, name: req.user.name });
            }
        })
    } catch (error) {
        console.log(error);
    }
});

//Welcome page
router.get('/', (req, res) => res.render('welcome'));
// //Dashboard page
// router.get('/index',
//     ensureAuthenticated,
//     (req, res) => {
//         console.log(req.user);
//         res.render('index', {
//             name: req.user.name
//         })
//     });

module.exports = router;