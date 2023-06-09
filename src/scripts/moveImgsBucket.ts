import db from '../db';
import { UserModel, TaskModel, FileModel } from '../db/models';
const fromBucket = 'mus-backet';
const toBucket = 'samott';

(async () => {
    try {
        await db();
        for await (const doc of FileModel.find().cursor()) {
            if (!doc.path) continue;
            doc.path = doc.path.replace(fromBucket, toBucket);
            await doc.save();
        }   
        for await (const doc of UserModel.find().cursor()) {
            if (doc.img) {
                doc.img = doc.img.replace(fromBucket, toBucket);
                await doc.save();
            }
        }  
        for await (const doc of TaskModel.find().cursor()) {
            if (doc.params['photos']) {
                for (const i in doc.params['photos']) {
                    doc.params['photos'][i] = doc.params['photos'][i].replace(fromBucket, toBucket);
                }
                doc.markModified('params');
                await doc.save();
            }
            if (doc.params['sound']) {
                doc.params['sound'] = doc.params['sound'].replace(fromBucket, toBucket);
                doc.markModified('params');
                await doc.save();
            }
        }
        console.log('Success');
    } catch (err) {
        console.error(err);
    }
})();