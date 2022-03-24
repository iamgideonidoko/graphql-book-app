import { Schema, model } from 'mongoose';
import { IAuthor } from '../interfaces/author.interface';

// Define Author Schema
const AuthorSchema = new Schema<IAuthor>({
    name: {
        //name of author
        type: String,
        required: true,
    },
    age: {
        //email of author
        type: Number,
        required: true,
    },
    created_at: {
        //time created
        type: Date,
        default: Date.now,
    },
});

//create Author model
const Author = model<IAuthor>('author', AuthorSchema);

//export the model
export default Author;