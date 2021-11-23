
import { updateLevelCounter } from '../controllers/TaskControllers';
import db from '../db';
db();
(async () => {
    try {
        await updateLevelCounter();
    } catch (err) {
        console.error(err);
    }
})();