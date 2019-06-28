const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const Cliente = require('../../models/cliente');
const Medico  = require('../../models/medico');  

// const getConsultas = async consultaIds => {
//     try {
//         const consultas = await Consulta.find({ _id: { $in: consultaIds} });
//         consultas.map(consulta => {
//             return {
//                 ..._consulta._doc,
//                 _id: consulta.id,
//                 date: new Date(consulta._doc.date).toISOString(),
//                 creator: cliente.bind(this, consulta.creator)
//             };
//         });
//     } catch(err) {
//         throw err;
//     }
// }

// const getConsulta = async consultaId => {
//     try {
//         const consulta = await Consulta.findById(consultaId);
//             return {
//                 ...consulta._doc,
//                 _id: consulta.id,
//                 date: new Date(consulta._doc.date).toISOString(),
//                 creator: cliente.bind(this, consulta.creator)
//             }
//     }catch(err) {
//         throw err;
//     }
// }

// const getCliente = async clienteId => {
//     try {
//         const cliente = await Cliente.findById(clienteId);
//         return {
//             ...cliente._doc,
//             _id: cliente.id,
//             createdConsulta: getConsultas.bind(this, cliente._doc.createdConsultas)
//         };
//     }catch(err) {
//         throw err;
//     }
// }


module.exports = {

    createCliente: async args => {
        try {
            const existingCliente = await Cliente.findOne({ email: args.clienteInput.email });
            if (existingCliente) {
                throw new Error("That email is taken. Try another.");
            }
            const hashedPassword = await bcrypt.hash(args.clienteInput.password, 12);
            const cliente = new Cliente({
                email: args.clienteInput.email,
                nome: args.clienteInput.nome,
                password: hashedPassword
            });
            const result = await cliente.save();
            return { ...result._doc, password: null };
        }
        catch (err) {
            throw err;
        }
    },
    createMedico: async args => {
        try {
            const existingMedico = await Medico.findOne({ email: args.medicoInput.email });
            if (existingMedico) {
                throw new Error("That email is taken. Try another.");
            }
            const hashedPassword = await bcrypt.hash(args.medicoInput.password, 12);
            const medico = new Medico({
                email: args.medicoInput.email,
                nome: args.medicoInput.nome,
                password: hashedPassword
            });
            const result = await medico.save();
            return { ...result._doc, password: null };
        }catch(err) {
            throw err;
        }
    },
    login: async (args) => {
        try {
            const medico = await Medico.findOne({ email: args.email });
            let cliente;
            let token;
            let isEqual;
            
            if(!medico) {
                cliente = await Cliente.findOne({ email: args.email });
                    if (!cliente) {
                        throw new Error("Cliente does not exist!");
                    }
                    isEqual = await bcrypt.compare(args.password, cliente.password);
                    if (!isEqual) {
                        throw new Error("Wrong password. Try again.");
                    }
                    token = jwt.sign({clienteId: cliente.id, email: cliente.email}, 'thispasswordissecret', {
                        expiresIn: '1h'
                    });
                    return { clienteId: cliente.id, token: token, tokenExpiration: 1 };
            }
            isEqual = await bcrypt.compare(args.password, medico.password);
            if (!isEqual) {
                throw new Error("Wrong password. Try again.");
            }
            token = jwt.sign({clienteId: medico.id, email: medico.email}, 'thispasswordissecret', {
                expiresIn: '1h'
            });
            return { clienteId: medico.id, token: token, tokenExpiration: 1 };
        }catch(err){
            throw err;
        }
    }
}