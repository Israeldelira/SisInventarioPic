const express = require('express');
const { format } = require('timeago.js')
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const db = require('./config/keys').MongoURI;
const morgan = require('morgan');
const multer = require('multer');

//Connect to Mongo,this would return the promise, so then.
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


//do a basic express server
const app = express();


require('./config/passport')(passport);

//EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/file/uploads'),
    filename: (req, file, cb, filname) => {
        cb(null, file.originalname);
        //cb(null, uuid + path.extname(file.originalname));
    }
});
app.use(multer({ storage: storage }).single('file'));

app.use((req, res, next) => {
    app.locals.format = format;
    next();
});




//Express  Session midleware 
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Passpoer midleware
app.use(passport.initialize());
app.use(passport.session());


//Connect flash
app.use(flash());



//Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//Routes

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/', require('./routes/upload'));
app.use(require('./routes/provedores'));
app.use(require('./routes/acciones'));
app.use(require('./routes/proyectos'));
app.use(require('./routes/detalles'));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'routes')));


const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', function() {
    console.log(`Listening to port: ${PORT}`);
});