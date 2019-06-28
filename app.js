/* 
 * Here it's pointing to the schemas, which are the types basically
 * so the events will ALWAYS receive a list of Events. list because of the [] with the type inside
 * and it's ALWAYS a Event, because of the '!', saying that cannot be a integer or null values,
 * but it can be an empty list.
 * 
 * On the mutation, it's where you are creating an event, which receives a String parameter that's name
 * and after it's what's the return, in this case a String.
 * 
 * And the rootValue is the resolvers, where you specify how the server actually handles what's
 * specified on the Schemas.
 */

const express         = require('express');
const bodyParser      = require('body-parser');
const graphqlHttp     = require('express-graphql');
const mongoose        = require('mongoose');

const graphqlSchema    = require('./graphql/schema/index.js');
const graphqlResolvers = require('./graphql/resolvers/index.js');

const isAuth = require('./middleware/is-auth');
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if(req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(isAuth);

app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
        graphiql: true
    })
);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
}@cluster0-fipfm.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, { useNewUrlParser: true })
.then(() =>{
    console.log('hi');
    app.listen(8000);
})
.catch(err => {
    console.log(err);
});
