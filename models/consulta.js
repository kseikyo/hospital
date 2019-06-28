const mongoose = require("mongoose");
const autopopulate = require('mongoose-autopopulate');
const Schema = mongoose.Schema;

const consultaSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    medico: {
        type: Schema.Types.ObjectId,
        ref: 'Medico',
        autopopulate: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        autopopulate: true
    }
});

consultaSchema.plugin(autopopulate);

module.exports = mongoose.model('Consulta', consultaSchema);