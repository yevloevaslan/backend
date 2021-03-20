import adminApp from './admins';
import config from './config';
const {adminPort} = config;

adminApp.listen(adminPort, () => {
    console.log(`Admin service listen on ${adminPort}`);
});