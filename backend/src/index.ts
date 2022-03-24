import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema/schema';
import mongoose from 'mongoose';

const app = express();

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true, // for testing our graphql query
}));

/* 
@description    MongoDB Connection using Mongoose ORM
*/
(async () => {
    try {
        await mongoose.connect(`mongodb://localhost:27017/graphql_book_app_db`);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.log('MONGODB CONNECTION ERROR: ' + err);
    }
})();

const PORT: number = Number(process.env.PORT) || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));