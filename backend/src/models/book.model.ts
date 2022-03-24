import { Schema, model } from 'mongoose';
import { IBook } from '../interfaces/book.interface';

// Define Book Schema
const BookSchema = new Schema<IBook>({
    name: {
        //name of book
        type: String,
        required: true,
    },
    genre: {
        //email of book
        type: String,
        required: true,
    },
    authorId: {
        //message from the book
        type: String,
        required: true,
    },
    created_at: {
        //time created
        type: Date,
        default: Date.now,
    },
});

//create Book model
const Book = model<IBook>('book', BookSchema);

//export the model
export default Book;