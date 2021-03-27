import adminApp from './admins';
import config from './config';
const {adminPort} = config;
import './scripts/insertTestAdmin';

adminApp.listen(adminPort, () => {
    console.log(`Admin service listen on ${adminPort}`);
});