import {Schema, model, Document} from 'mongoose';
import { IVocabulary } from '../../entities/Vocabulary.entity';

export interface IVocabularyModel extends IVocabulary, Document {
    rus: string,
    ing: string
}

const Vocabulary = new Schema({
    rus: {
        type: String,
        required: true,
    },
    ing: {
        type: String,
        required: true,
    },
});

export const VocabularyModel = model<IVocabularyModel>('vocabulary', Vocabulary);