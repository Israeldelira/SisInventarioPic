const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


//User model
const User = require('../models/User');

//Login Page
router.get('/login', (req, res) => res.render('login'));

//Register Page
router.get('/register', (req, res) => res.render('register'));


//When we submit registration form
router.post('/register', (req, res) => {
    const { name, password, password2 } = req.body;

    //Validation
    let errors = [];

    //Check required fileds
    if (!name || !password || !password2) {
        errors.push({ msg: 'Ingresa todos los campos' });
    }

    //Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Las contraseñas no coinciden' });
    }

    //Check lenght of pass
    if (password.length < 5) {
        errors.push({ msg: 'Debe ser mayor a 5 caracteres' });
    }

    //
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,

            password,
            password2
        });
    } else {
        //Validation passed
        User.findOne({ name: name }) //return promise
            .then(user => {
                if (user) {
                    //user exist
                    errors.push({ msg: 'El Usuario ya existe ' });
                    res.render('register', {
                        errors,
                        name,

                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,

                        password
                    });

                    console.log(newUser);

                    //Hash Password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            //Set passwrod Hashed
                            newUser.password = hash;
                            //Save User
                            newUser
                                .save() //return promise
                                .then(user => {
                                    req.flash(
                                        'success_msg',
                                        'Registro exitoso'
                                    );
                                    res.redirect('/users/login');
                                })
                                .catch(err => console.log(err));
                        })
                    });
                }
            });
    }

});

//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/index',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Sesion cerrada');
    res.redirect('/users/login');
});


module.exports = router;