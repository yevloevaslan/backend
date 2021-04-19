import {DictionatyModel} from '../../db/models/DictionaryModel';
import {wordDataInterface, wordInterface} from '../interfaces';
import {conflict} from 'boom';
import {Document} from 'mongoose';
import {IDictionary} from '../../entities/Dictionary.entity';


export default class DictionaryClass {
    private dict: IDictionary&Document;
    
    constructor(data?: IDictionary&Document) {
        this.dict = data;
    }

    async createWord(data: wordDataInterface): Promise<void> {
        if (this.dict) {
            console.error('Conflict in creating this word', JSON.stringify({word: this.dict, data}));
            throw conflict('Слово уже существует');
        }
        this.dict = await new DictionatyModel(data).save();
        return;
    }

    async updateWord(data: wordInterface): Promise<void> {
        if (data.rus) this.dict.rus = data.rus;
        if (data.ing) this.dict.ing = data.ing;
        await this.dict.save();
        return;
    }

    async deleteWord(data: {_id: string}): Promise<boolean> {
        await DictionatyModel.deleteOne({_id: data._id});
        return true;
    }

    async findWord(query: wordInterface): Promise<IDictionary> {
        const word = await DictionatyModel.findOne(query);
        return word;
    }
}
