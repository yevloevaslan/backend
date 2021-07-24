import {GrammarModel} from '../db/models';
import { IGrammarEntity } from '../entities/Grammar.entity'

const getGrammarFile = async (): Promise<{ data: IGrammarEntity }>  => {
    const file = await GrammarModel.findOne()
    if (!file) return { data: { filename: '' } }
    return { data: file };
}

const editGrammarFile = async (filename: string): Promise<{ data: IGrammarEntity }> => {
    const result = await GrammarModel.findOne();
    if (result) {
        await GrammarModel.updateOne({_id: result._id}, {$set: { filename }});
    } else {
        await new GrammarModel({ filename }).save();
    }
    return {
        data: {
            filename
        }
    };
}

export {
    getGrammarFile,
    editGrammarFile
}