const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let entradasSchema = new Schema({
    name: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    idarticulo: {
        type: Schema.Types.ObjectId,
        ref: 'Articulo',
        required: [true, 'Por favor ingresa el id']
    },

    cantidad: {
        type: Number,
        ref: 'Articulo'

    },


    created_at: { type: Date, default: Date.now() }
});




entradasSchema.plugin(uniquevalidator, {
    message: '{PATH} Debe ser unico y diferente'
});

module.exports = mongoose.model('Entradas', entradasSchema);