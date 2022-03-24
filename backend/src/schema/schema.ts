import { GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import _ from 'lodash';
import Author from '../models/author.model';
import Book from "../models/book.model";


// dummy data
const books = [
    { name: 'Name of the wind', genre: 'Fantasy', id: '1', authorId: '1' },
    { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
    { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
    { name: 'The Hero of Ages', genre: 'Fantasy', id: '3', authorId: '4' },
    { name: 'The colour of Magic', genre: 'Fantasy', id: '3', authorId: '5' },
    { name: 'The Light Fantastic', genre: 'Fantasy', id: '3', authorId: '6' },
];

const authors = [
    { name: 'Patrick Rothfus', age: 44, id: '1' },
    { name: 'Brandon Sanderson', age: 42, id: '2' },
    { name: 'Terry Pratchett', age: 66, id: '3' },
]

const BookType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({ // function
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve: async (parent, args) => {
                console.log('parent => ', parent);
                // return _.find(authors, { id: parent.authorId })
                const fetchedAuthor = await Author.findById(parent.authorId);
                return fetchedAuthor;
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
        books: {
            type: new GraphQLList(BookType),
            resolve: async (parent, args) => {
                // return _.filter(books, { authorId: parent.id })
                const fetchedBooks = await Book.find({ authorId: parent.id });
                return fetchedBooks;
            }
        }
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
            resolve: async (parent, args) => { // query to the db is made here in the resolve function
                // return _.find(books, { id: args.id });
                const fetchedBook = await Book.findById(args.id);
                return fetchedBook;
            }
        },
        author: {
            type: AuthorType,
            args: { 
                id: { type: GraphQLID } 
            },
            resolve: async (parent, args) => {
                // return _.find(authors, { id: args.id })
                const fetchedAuthor = await Author.findById(args.id);
                return fetchedAuthor;
            }
        },
        books: {
            type: new GraphQLList(BookType), // to get all the books
            resolve: async (parent, args) => {
                // return books;
                const allBooks = await Book.find();
                return allBooks;
            }
        },
        authors: {
            type: new GraphQLList(AuthorType), // to get all the books
            resolve: async (parent, args) => {
                // return authors;
                const allAuthors = await Author.find();
                return allAuthors;
            }
        }

    }
});

/* 
Ex of query
{
    book (id: 1) {
        name
        genre
        author {
            name
        }
    }
}

*/

const Mutation = new GraphQLObjectType({ // for adding, updating and deleting data in the db
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                age: {
                    type: new GraphQLNonNull(GraphQLInt)
                }

            },
            resolve: async (parent, args) => {
                const newAuthor = new Author({
                    name: args.name,
                    age: args.age,
                });
                const savedAuthor = await newAuthor.save(); // save the author to the db
                return savedAuthor;
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                genre: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                authorId: {
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            resolve: async (parent, args) => {
                const newBook = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                const savedBook = await newBook.save(); // save the book to the db
                return savedBook;
            }
        }
    }
});

/*
Ex of mutation

mutation {
  addAuthor(name: "Shaun", age: 30) {
    name
    age
  }
} 
*/

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});

export default schema;