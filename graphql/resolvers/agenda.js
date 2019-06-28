const Agenda = require('../../models/agenda');
const Consulta   = require('../../models/consulta');

const { transformAgenda } = require('./merge');
const { transformConsulta } = require('./merge');


module.exports = {
    agendas: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Cliente not authenticated!');
        }
        try {
            const agendas = await Agenda.find();
            
            return agendas.map(agenda => {
                return transformAgenda(agenda);
            });
        }
        catch(err) {
            throw err;
        }
    },
    bookConsulta: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Cliente not authenticated!');
        }
        try {
            const fetchedConsulta = await Consulta.findOne({ id: args.consultaId });
            const agenda = new Agenda({
                cliente: req.clienteId,
                consulta: fetchedConsulta
            });
            const result = await agenda.save();
            return transformAgenda(result);
        }catch(err) {
            throw err;
        }
    },
    cancelAgenda: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Cliente not authenticated!');
        }
        try {
            const agenda = await Agenda.findById(args.agendaId);
            const consulta = transformConsulta(agenda.consulta);
            await Agenda.deleteOne({ _id: args.agendaId});
            return consulta;
        }catch(err) {
            throw err;
        }
    }
}