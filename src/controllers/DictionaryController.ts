import { DictionaryModel } from '../db/models';
import { conflict } from 'boom';
import { IDictionary } from '../entities/Dictionary.entity';
import Joi from 'joi';
import { schemaErrorHandler } from '../libs/joiSchemaValidation';
import { paginationParams } from '../libs/checkInputParameters';

interface createWord {
    rus: string,
    ing: string,
    ingDescription?: string,
    rusDescription?: string,
}

interface wordInterface {
    _id?: string,
    rus?: string,
    ing?: string,
}

interface wordResultData {
    data: {
        rus: string,
        ing: string
    }
}

interface booleanResult {
    data: boolean
}
interface WordResultMeta {
    count: number,
}
interface findResult {
    data: Array<IDictionary>,
    meta: WordResultMeta
}


const wordMainSchema = Joi.object({
    rus: Joi.string().required(),
    ing: Joi.string().required(),
    ingDescription: Joi.string(),
    rusDescription: Joi.string(),
});

const wordSchema = Joi.object({
    _id: Joi.string(),
    rus: Joi.string(),
    ing: Joi.string(),
}).unknown();
const updateWordSchema = Joi.object({
    _id: Joi.string().required(),
    rus: Joi.string(),
    ing: Joi.string(),
});

const deleteWordSchema = Joi.object({
    _id: Joi.string().required(),
});

const createWord = async (data: createWord): Promise<wordResultData> => {
    data = {
        rus: data.rus.toLowerCase(),
        ing: data.ing.toLowerCase(),
        ingDescription: data.ingDescription ? data.ingDescription.toLowerCase() : null,
        rusDescription: data.rusDescription ? data.rusDescription.toLowerCase() : null,
    };
    if (data.ingDescription === null) delete data.ingDescription;
    if (data.rusDescription === null) delete data.rusDescription;
    schemaErrorHandler(wordMainSchema.validate(data));
    const findData = {
        rus: data.rus,
        ing: data.ing,
    };
    
    const word = await DictionaryModel.findOne(findData);
    if (word) {
        console.error('Conflict in creating word');
        throw conflict('Слово уже существует');
    }
    await new DictionaryModel(data).save();
    return {
        data,
    };
};

const updateWord = async (data: wordInterface): Promise<booleanResult> => {
    schemaErrorHandler(updateWordSchema.validate(data));
    const updateData: wordInterface = {};
    if (data.rus) updateData.rus = data.rus.toLowerCase();
    if (data.ing) updateData.ing = data.ing.toLowerCase();
    await DictionaryModel.updateOne({ _id: data._id }, { $set: updateData });
    return {
        data: true,
    };
};

const deleteWord = async (data: { _id: string }): Promise<booleanResult> => {
    schemaErrorHandler(deleteWordSchema.validate(data));
    await DictionaryModel.deleteOne({ _id: data._id });
    return {
        data: true,
    };
};

const findWord = async (query?: wordInterface, options?: { limit?: unknown, page?: unknown }): Promise<findResult> => {
    schemaErrorHandler(wordSchema.validate(query));
    const { skip, limit } = paginationParams(options.page, options.limit);
    const wordQuery: Record<string, RegExp | string> = {};
    if (query?.rus) wordQuery.rus = /`^${query.rus.toLowerCase()}`/;
    if (query?.ing) wordQuery.ing = /`^${query.ing.toLowerCase()}`/;
    if (query._id) wordQuery._id = query._id;
    const [word, count] = await Promise.all([
        DictionaryModel.find(wordQuery).skip(skip).limit(limit).lean(),
        DictionaryModel.countDocuments(wordQuery),
    ]);
    return {
        data: word,
        meta: {
            count,
        },
    };
};

export {
    createWord,
    updateWord,
    deleteWord,
    findWord,
};