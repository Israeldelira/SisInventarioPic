const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let articuloSchema = new Schema({
    nombre: {
        type: String,
    },
    modelo: {
        type: String,
    },
    categoria: {
        type: String,

    },
    cantidad: {
        type: Number


    },
    // descSalida: {

    //     type: String,

    // },


    // proyecto: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Proyecto'
    // },
    provedor: {
        type: String
    },




    ubicacion: {
        type: String,


    },
    disponible: {
        type: Boolean,
        default: true

    },

    filename: { type: String },
    path: { type: String },
    originalname: { type: String },
    mimetype: { type: String },
    size: { type: Number },
    created_at: { type: Date, default: Date.now() }
});


articuloSchema.plugin(uniquevalidator, {
    message: '{PATH} Debe ser unico y diferente'
});

module.exports = mongoose.model('Articulo', articuloSchema);