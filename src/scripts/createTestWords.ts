import { VocabularyModel } from '../db/models';
import {generateWord} from '../libs/generateWord';

import db from '../db';
db();

(async () => {
    for (let i = 0; i < 1000000; i++) {
        await new VocabularyModel({
            rus: generateWord(20),
            ing: generateWord(20),
        }).save();
    }
    console.log('success');
})();
