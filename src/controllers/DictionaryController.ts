import {DictionaryModel} from '../db/models';
import {conflict} from 'boom';
import {IDictionary} from '../entities/Dictionary.entity';
import Joi from 'joi';
import {schemaErrorHandler} from '../libs/joiSchemaValidation';

interface createWord {
    rus: string,
    ing: string,
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

interface findResult {
    data: IDictionary []
}

const wordMainSchema = Joi.object({
    rus: Joi.string().required(),
    ing: Joi.string().required(),
});

const wordSchema = Joi.object({
    rus: Joi.string(),
    ing: Joi.string(),
});

const deleteWordSchema = Joi.object({
    _id: Joi.string().required(),
});

const createWord = async (data: createWord): Promise<wordResultData> => {
    schemaErrorHandler(wordMainSchema.validate(data));
    const word = await DictionaryModel.findOne(data);
    if (word) {
        console.error('Conflict in creating word');
        throw conflict('Слово уже существует');
    }
    await new DictionaryModel(data).save();
    return {
        data: {
            rus: data.rus,
            ing: data.ing,
        },
    };
};

const updateWord = async (data: wordInterface): Promise<booleanResult> => {
    schemaErrorHandler(wordSchema.validate(data));
    const query: wordInterface = {};
    if (data.rus) query.rus = data.rus;
    if (data.ing) query.ing = data.ing;
    await DictionaryModel.updateOne({_id: data._id}, {$set: query});
    return {
        data: true,
    };
};

const deleteWord = async (data: { _id: string }): Promise<booleanResult> => {
    schemaErrorHandler(deleteWordSchema.validate(data));
    await DictionaryModel.deleteOne({_id: data._id});
    return {
        data: true,
    };
};

const findWord = async (data: wordInterface): Promise<findResult> => {
    schemaErrorHandler(wordSchema.validate(data));
    let result = [];
    if (data.rus) {
        result = await DictionaryModel.find({rus: {$regex: `^${data.rus}`}}).limit(10);
    }
    if (data.ing) {
        result = await DictionaryModel.find({ing: {$regex: `^${data.ing}`}}).limit(10);
    }
    return {
        data: result,
    };
};

export {
    createWord,
    updateWord,
    deleteWord,
    findWord,
};