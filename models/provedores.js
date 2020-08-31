const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');




let Schema = mongoose.Schema;

let provedoresSchema = new Schema({

    nombreProv: {
        type: String,
        required: [true, 'Por favor ingresa el nombre del provedor']
    },
    direccion: {
        type: String,
        required: [true, 'Por favor ingresa la direccion']
    },
    telefono: {
        type: Number,
        required: [true, 'Por favor ingresa la categoria']
    },

    disponible: {
        type: Boolean,
        default: true

    },


    fechaRegistro: {
        type: Date,
        default: Date.now()
    }
});

provedoresSchema.plugin(uniquevalidator, {
    message: '{PATH} Debe ser unico y diferente'
});

module.exports = mongoose.model('Provedores', provedoresSchema);