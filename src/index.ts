import app from './app';
import config from './config/index';
const {port} = config;

app.listen(port, () => {
    console.log('Listen on ' + port);
});
