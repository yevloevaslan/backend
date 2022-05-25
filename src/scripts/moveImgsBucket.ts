import db from '../db';
import { UserModel, TaskModel } from '../db/models';
const fromBucket = 'mus-backet';
const toBucket = 'samott';

(async () => {
    try {
        await db();
        for await (const doc of UserModel.find().cursor()) {
            doc.img = doc.img.replace(fromBucket, toBucket);
            await doc.save();
        }  
        for await (const doc of TaskModel.find().cursor()) {
            if (doc.params['photos']) {
                for (const i in doc.params['photos']) {
                    doc.params['photos'][i] = doc.params['photos'][i].replace(fromBucket, toBucket);
                }
            }
            if (doc.params['sound']) {
                doc.params['sound'] = doc.params['sound'].replace(fromBucket, toBucket);
            }
            await doc.save();
        }
    } catch (err) {
        console.error(err);
    }
})();