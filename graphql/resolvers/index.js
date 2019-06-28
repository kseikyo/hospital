const authResolver = require('./auth');
const consultasResolver = require('./consultas');
const agendaResolver = require('./agenda');
const medicoResolver = require('./medico');
const rootResolver = {
    ...authResolver,
    ...medicoResolver,
    ...consultasResolver,
    ...agendaResolver
};

module.exports = rootResolver;