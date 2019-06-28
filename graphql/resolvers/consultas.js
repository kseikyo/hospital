const Consulta   = require('../../models/consulta');
const Cliente    = require('../../models/cliente');
const Medico     = require('../../models/medico');
const { dateToString } = require('../../helpers/date');
const { transformConsulta } = require('./merge');

const mongoose = require('mongoose');

module.exports = {
    consultas: async () => {
        try {
            const consultas = await Consulta.find();
            return consultas.map(consulta => {
                return transformConsulta(consulta);
            });
        }
        catch (err) {
            throw err;
        }
    },
    userConsultas: async (args, req) => {
        try {
            const consultas = await Consulta.findOne({ _id: req.userId});
            if(consultas){
                return consultas.map(consulta => {
                    return transformConsulta(consulta);
                });
            }
            return;
        }catch(err) {
            throw err;
        }
    },
    createConsulta: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Cliente não autenticado!');
        }
        // console.log(args.consultaInput.medico);
        // let med = Medico.find({ nome: args.consultaInput.medico});
        // console.log({...med._doc});
        
        const consulta = new Consulta({
            title: args.consultaInput.title,
            description: args.consultaInput.description,
            date: dateToString(args.consultaInput.date),
            creator: Cliente.findById(req.clienteId),
            medico: Medico.findById(args.consultaInput.medico)
        });
        let createdConsulta;
        try {
            const result = await consulta.save();
            createdConsulta = result;
            const cliente = await Cliente.findById(req.clienteId);
            if (!cliente) {
                throw new Error('Cliente not found.');
            }
            cliente.createdConsultas.push(consulta);
            const medico = await Medico.findById(args.consultaInput.medico);
            if (!medico) {
                throw new Error('medico not found.');
            }
            medico.Consultas.push(consulta);
            const result_1 = await cliente.save();
            return createdConsulta;
        }
        catch (err) {
            throw err;
        }
    }
}