import { GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import _ from 'lodash';


// dummy data
const books = [
    { name: 'Name of the wind', genre: 'Fantasy', id: '1', authorId: '1' },
    { name: 'Name of the sun', genre: 'Fantasy', id: '2', authorId: '2' },
    { name: 'Name of the moon', genre: 'sci-fi', id: '3', authorId: '3' },
];

const authors = [
    { name: 'Patrick Rothfus', age: 44, id: '1' },
    { name: 'Brandon Sanderson', age: 42, id: '2' },
    { name: 'Terry Pratchett', age: 66, id: '3' },
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({ // function
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve: (parent, args) => {
                console.log('parent => ', parent);
                return _.find(authors, { id: parent.authorId })
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({ // function
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
    })
});

/*
Root queries define how the user can jump into the graph and get data. 
 */

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: { //Root Query fields do not have to be a function that returns and object.
        book: {
            type: BookType,
            args: { // required arguments when the user is making a query to book
                id: {
                    type: GraphQLID
                }
            },
            resolve: (parent, args) => { // query to the db is made here in the resolve function
                return _.find(books, { id: args.id });
            }
        },
        author: {
            type: AuthorType,
            args: { 
                id: { type: GraphQLID } 
            },
            resolve: (parent, args) => {
                return _.find(authors, { id: args.id })
            }
        }

    }
})

const schema = new GraphQLSchema({
    query: RootQuery
});

export default schema;