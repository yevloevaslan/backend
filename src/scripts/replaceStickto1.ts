
import db from '../db';
db();

import {DictionaryModel} from '../db/models';
(async () => {
    try {
        (await DictionaryModel.find({'ing': {$regex: /ӏ/g}})).forEach(async function(doc) {
            doc.ing = doc.ing.replace(/ӏ/g, '1');    
            console.log(doc.ing); 
            await doc.save();
        });
        console.log('done');
    } catch (err) {
        console.error(err);
    }
})();