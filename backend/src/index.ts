import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema/schema';

const app = express();

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true, // for testing our graphql query
}));

const PORT: number = Number(process.env.PORT) || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));