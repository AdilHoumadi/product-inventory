import {app} from './app';
import * as http from 'http';

const PORT = 8000;
const HOST = '0.0.0.0';
const server = http.createServer(app);
server.listen(PORT, HOST);
server.on('listening', () => {
    console.info(`Product inventory API is listening on port http://${HOST}:${PORT}`);
});
