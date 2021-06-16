const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/schema');
//const mongoose = require('mongoose');
//const cors = require('cors');

const app = express();


app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(3000, () => {
    console.log('now listening for requests on port 3000');
});