import {wordDataInterface, wordInterface} from './interfaces';
import {DictionaryModel} from '../db/models';
import {conflict} from 'boom';
import {IDictionary} from '../entities/Dictionary.entity';

interface wordResultData {
    data: {
        rus: string,
        ing: string
    }
}

interface voidResult {
    data: null
}

interface deleteResult {
    data: boolean
}

interface findResult {
    data: IDictionary []
}

const createWord = async (data: wordDataInterface): Promise<wordResultData> => {
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

const updateWord = async (data: wordInterface): Promise<voidResult> => {
    const query: wordInterface = {};
    if (data.rus) query.rus = data.rus;
    if (data.ing) query.ing = data.ing;
    await DictionaryModel.updateOne({_id: data._id}, {$set: query});
    return {
        data: null,
    };
};

const deleteWord = async (data: { _id: string }): Promise<deleteResult> => {
    await DictionaryModel.deleteOne({_id: data._id});
    return {
        data: true,
    };
};

const findWord = async (query: wordInterface):Promise<findResult> => {
    let result = [];
    if (query.rus) {
        result = await DictionaryModel.find({rus: {$regex: `/^${query.rus}/i`}});
    }
    if (query.ing) {
        result = await DictionaryModel.find({ing: {$regex: `/^${query.ing}`}});
    }
    if (!result) throw conflict('Слова не найдены');
    
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