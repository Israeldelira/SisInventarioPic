const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let proyectosSchema = new Schema({

    nombreProyecto: {
        type: String,
        required: [true, 'Por favor ingresa el nombre del PROYECTO']
    },

    empresa: {
        type: String,
        required: [true, 'Por favor ingresa la empresa']
    },
    salidas: [{
        nombreArticulo: {
            type: String,

        },

        numCantidad: {
            type: String,

        },

        descSalida: {

            type: String,

        },
        fechaBaja: {

            type: Date,
            default: Date.now()
        },
        registroNombre: {

            type: String
        }


    }],

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




proyectosSchema.plugin(uniquevalidator, {
    message: '{PATH} Debe ser unico y diferente'
});

module.exports = mongoose.model('Proyecto', proyectosSchema);