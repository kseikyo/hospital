const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const clienteSchema = new Schema({
    email: {
        type:     String,
        required: true
    },
    password: {
        type:     String,
        required: true,
    },
    createdConsultas: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Consulta',
            autopopulate: true
        }
    ]
});

clienteSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Cliente', clienteSchema);