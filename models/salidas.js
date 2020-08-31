const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let SalidasSchema = new Schema({
    nomRegistro: {
        type: String,

    },
    nombre: {
        type: String,
        required: [true, 'Por favor ingresa el nombre del articulo']
    },
    cantidad: {
        type: String,
        required: [true, 'Por favor ingresa la cantidad de salida']
    },
    nombreProyecto: {
        type: String,
        required: [true, 'Por favor ingresa el nombre del proyecto']
    },

    descSalida: {
        type: String,

        required: [true, 'Por favor ingresa la descripcion de la salida']
    },
    fechaRegistro: {
        type: Date,
        default: Date.now()
    },



    filename: { type: String },
    path: { type: String },
    originalname: { type: String },
    mimetype: { type: String },
    size: { type: Number },
    created_at: { type: Date, default: Date.now() }
});

SalidasSchema.plugin(uniquevalidator, {
    message: '{PATH} Debe ser unico y diferente'
});

module.exports = mongoose.model('Salidas', SalidasSchema);