import schedule from 'node-schedule';
import {UserModel, FileModel, TaskModel} from './db/models';
import db from './db';
import moment from 'moment';
import {deleteObject} from './libs/upload';
db();

const updateScoreRating = async ():Promise<boolean> => {
    try {
        const users = await UserModel.find({}).sort({score: 'desc'});
        let i = 1;
        for (const user of users) {
            await UserModel.updateOne({_id: user.id}, {$set: {rating: i}});
            i++;
        }
        return true;
    } catch (err) {
        console.error(err);
    }
};

const deleteUnusedFiles = async () => {
    try {
        const limit = 100;
        let skip = await FileModel.countDocuments({createdAt: {$lte: moment().add(-30, 'minutes')}});
        while (skip) {
            const files = await FileModel.find().limit(limit).skip(0);

            for (const file of files) {
                const [fileExists1, fileExists2] = await Promise.all([
                    UserModel.findOne({img: file.path}, {_id: 1}).lean(),
                    TaskModel.findOne({$or: [{'params.photos': file.path}, {'params.sound': file.path}]}, {_id: 1}).lean(),
                ]);
                if (!fileExists1 && !fileExists2) {
                    await FileModel.deleteOne({_id: file._id});
                    await deleteObject(file.key);
                }
            }

            skip -= limit;
        }
    } catch (err) {
        console.error(err);
    }
};

schedule.scheduleJob('*/30 * * * * *', updateScoreRating);
schedule.scheduleJob('* * */1 * * *', deleteUnusedFiles);
