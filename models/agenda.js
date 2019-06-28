const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const agendaSchema = new Schema({ 
    consulta: {
        type: Schema.Types.ObjectId,
        ref: 'Consulta',
        autopopulate: true
    },
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        autopopulate: true
    }
}, { timestamps: true });

agendaSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Agenda', agendaSchema);