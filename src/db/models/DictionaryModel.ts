import {Schema, model, Document} from 'mongoose';
import {IDictionary} from '../../entities/Dictionary.entity';

const Dictionary = new Schema({
    rus: {
        type: String,
        required: true,
        unique: true,
    },
    ing: {
        type: String,
        required: true,
        unique: true,
    },
});

export const DictionatyModel = model<IDictionary&Document>('dictionary', Dictionary);