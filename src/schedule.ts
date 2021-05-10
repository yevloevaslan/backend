import schedule from 'node-schedule';
import {UserModel} from './db/models';
import db from './db';
db();

export const updateScoreRating = async ():Promise<boolean> => {
    const users = await UserModel.find({}).sort({score: 'desc'});
    let i = 1;
    for (const user of users) {
        await UserModel.updateOne({_id: user.id}, {$set: {rating: i}});
        i++;
    }
    return true;
};

schedule.scheduleJob('*/10 * * * * *', updateScoreRating);