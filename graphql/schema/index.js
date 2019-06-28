const { buildSchema } = require('graphql');


/* '_' before id means that MongoDB will look for the underscore before the variable to store;
 * The '!' after the type means NOT NULL;
 * The input keyword it's input from the front-end, and it's just to be more clear instead of 
 * putting all of it's attributes as parameters;
 */
module.exports = buildSchema(`
        type Agenda {
            _id: ID!
            consulta: Consulta!
            cliente:  Cliente!
            createdAt: String!
            updatedAt: String!
        }

        type Consulta {
            _id: ID!
            title: String!
            description: String!
            price: String!
            date: String!
            creator: Cliente!
            medico: Medico!
        }

        type Cliente {
            _id: ID!
            nome: String!
            email: String!
            password: String
            createdConsultas: [Consulta!]
        }

        type Medico {
            _id: ID!
            nome: String!
            email: String!
            password: String
            consultas: [Consulta!]
        }

        type AuthData {
            clienteId: ID!
            token: String!
            tokenExpiration: Int!
        }

        input ConsultaInput {
            title: String!
            description: String!
            price: String!
            date: String!
            medico: String!
        }


        input ClienteInput {
            email: String!
            nome : String!
            password: String!
        }

        input MedicoInput {
            email: String!
            nome : String!
            password: String!
        }

        type RootQuery {
            consultas: [Consulta!]!
            agendas: [Agenda!]!
            login(email: String!, password: String!): AuthData!
            userConsultas(userId: ID!): [Consulta!]
            medicos: [Medico!]!
            medico(nome: String!): Medico!
        }

        type RootMutation {
            createConsulta(consultaInput: ConsultaInput): Consulta
            createCliente(clienteInput: ClienteInput): Cliente
            createMedico(medicoInput: MedicoInput): Medico
            bookConsulta(consultaId: ID!): Agenda!
            cancelAgenda(agendaId: ID!): Consulta!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `)