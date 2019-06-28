const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const medicoSchema = new Schema({
    email: {
        type:     String,
        required: true
    },
    password: {
        type:     String,
        required: true,
    },
    nome: {
        type: String,
        required: true
    },
    Consultas: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Consulta',
            autopopulate: true
        }
    ]
});

medicoSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Medico', medicoSchema);