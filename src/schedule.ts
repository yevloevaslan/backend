import schedule from 'node-schedule';
import {UserModel, FileModel, TaskModel, AboutProjectModel, GrammarModel} from './db/models';
import db from './db';
import moment from 'moment';
import {deleteObject} from './libs/upload';
import {updateLevelCounter} from './controllers/TaskControllers';
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
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            const limit = 100;
            const count = await FileModel.countDocuments({createdAt: {$lte: moment().add(-30, 'minutes')}});
            let skip = 0;
            console.log('START WHILE', skip);
            while (skip < count) {
                const files = await FileModel.find({createdAt: {$lte: moment().add(-30, 'minutes')}}).limit(limit).skip(skip);

                for (const file of files) {
                    const [fileExists1, fileExists2, fileExists3, fileExists4, fileExists5] = await Promise.all([
                        UserModel.findOne({img: file.path}, {_id: 1}).lean(),
                        TaskModel.findOne({$or: [{'params.photos': file.path}, {'params.sound': file.path}]}, {_id: 1}).lean(),
                        AboutProjectModel.findOne({$or: [
                            {'project.photos': { $in: [file.path] }},
                            {'author.photos': { $in: [file.path] }},
                            {'banner': { $in: [file.path] }},
                        ]}, {_id: 1}).lean(),
                        AboutProjectModel.findOne({ banner: file.path }),
                        GrammarModel.findOne({filename: file.path }),
                    ]);
                    if (!fileExists1 && !fileExists2 && !fileExists3 && !fileExists4 && !fileExists5) {
                        await FileModel.deleteOne({_id: file._id});
                        await deleteObject(file.key);
                    }
                }

                skip += limit;
                console.log('Iter end', skip);
            }
            console.log('While end');
        } catch (err) {
            console.error(err);
        }
        await new Promise((resolve, _reject) => {
            setTimeout(() => {
                resolve(true);
            }, 3 * 60 * 1000);
        });
    }
};

// deleteUnusedFiles();

const updateLevelCounterJob = async()=>{
    await updateLevelCounter();
};

schedule.scheduleJob('*/30 * * * * *', updateScoreRating);

schedule.scheduleJob('00 12 * * *', updateLevelCounterJob);