import {Schema, model, Document} from 'mongoose';
import {IDictionary} from '../../entities/Dictionary.entity';

const Dictionary = new Schema({
    rus: {
        type: String,
        required: true,
    },
    ing: {
        type: String,
        required: true,
    },
    ingDescription: String,
    rusDescription: String,
});

export const DictionaryModel = model<IDictionary&Document>('dictionary', Dictionary);