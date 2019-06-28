const { dateToString } = require('../../helpers/date');
const Medico = require('../../models/medico');
module.exports = {
    medicos: async () => {
        try {
            const medicos = await Medico.find();
            return medicos.map(medico => {
                return {
                    ...medico._doc,
                };
            });
        }
        catch (err) {
            throw err;
        }
    },
    medico: async args => {
        try {
            const medicos = await Medico.findOne({nome: args.nome});
            if(medicos){
                return {
                    ...medicos._doc,
                };
            };
        }
        catch (err) {
            throw err;
        }
}
}