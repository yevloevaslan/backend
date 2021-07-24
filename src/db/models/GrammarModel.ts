import {Schema, model, Document} from 'mongoose';
import {IGrammarEntity} from '../../entities/Grammar.entity';

const Grammar = new Schema({
    filename: {
        type: String,
        required: true
    }
});

export const GrammarModel = model<Document&IGrammarEntity>('grammar', Grammar);