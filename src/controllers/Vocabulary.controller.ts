import Joi from 'joi';
import { VocabularyModel } from '../db/models';
import { IVocabularyModel } from '../db/models/Vocabulary.model';
import { schemaErrorHandler} from '../libs/joiSchemaValidation';

const getWordsInput = Joi.object({
    language: Joi.string().required().valid(['rus', 'ing']),
    pattern: Joi.string().required(),
});

interface getWordsResult {
    data: Array<{
        rus: string,
        ing: string,
    }>
}

const getWords = async (pattern: string, language: string): Promise<getWordsResult> => {
    schemaErrorHandler(getWordsInput.validate({pattern, language}));

    const result = await VocabularyModel.aggregate<IVocabularyModel>([
        {$match: { [language]: { $regex: `^${pattern}` } }},
        {$unwind: `$${language}`},
        {$project: { _id: 0 }}, 
        {$limit: 10},
    ]);

    return {
        data: result,
    };
};

export {
    getWords,
};