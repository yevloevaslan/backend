import {wordDataInterface, wordInterface} from './interfaces';
import {DictionaryModel} from '../db/models/DictionaryModel';
import {conflict} from 'boom';
import {IDictionary} from '../entities/Dictionary.entity';

const createWord = async (data: wordDataInterface): Promise<void> => {
    const word = await DictionaryModel.findOne(data);
    if (word) {
        console.error('Conflict in creating word');
        throw conflict('Слово уже существует');
    }
    await new DictionaryModel(data).save();
    return;
};

const updateWord = async (data: wordInterface): Promise<void> => {
    const query: wordInterface = {};
    if (data.rus) query.rus = data.rus;
    if (data.ing) query.ing = data.ing;
    await DictionaryModel.updateOne({_id: data._id}, {$set: query});
    return;
};

const deleteWord = async (data: { _id: string }): Promise<boolean> => {
    await DictionaryModel.deleteOne({_id: data._id});
    return true;
};

const findWord = async (query: wordInterface): Promise<IDictionary> => {
    const word = await DictionaryModel.findOne(query);
    return word;
};

export {
    createWord,
    updateWord,
    deleteWord,
    findWord,
};