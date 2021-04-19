import {Schema, model, Document} from 'mongoose';
import {IDictionary} from '../../entities/Dictionary.entity';

const Dictionary = new Schema({
    rus: {
        type: String,
        unique: true,
    },
    ing: {
        type: String,
        unique: true,
    },
});

export const DictionaryModel = model<IDictionary&Document>('dictionary', Dictionary);