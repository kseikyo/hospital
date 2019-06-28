const Consulta   = require('../../models/consulta');
const Cliente    = require('../../models/cliente');
const { dateToString } = require('../../helpers/date');



const transformConsulta = consulta => {
    return {
        ...consulta._doc,
        date: dateToString(consulta._doc.date)
    };
}

const transformAgenda = agenda => {
    return {
        ...agenda._doc,
        cliente: Cliente.findOne(agenda._doc.cliente),
        consulta: Consulta.findOne(agenda._doc.consulta),
        createdAt: dateToString(agenda._doc.createdAt),
        updatedAt: dateToString(agenda._doc.updatedAt)
    };
}

exports.transformAgenda = transformAgenda;
exports.transformConsulta   = transformConsulta;