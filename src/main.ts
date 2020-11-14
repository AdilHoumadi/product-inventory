import {app} from './app';
import * as http from 'http';
import {MongoDb} from "./persistance/mongo";
import {Settings as s, ConnStr} from "./config/settings";

const server = http.createServer(app);
server.listen(s.appPort, s.appHost);
server.on('listening', async () => {
    console.info(`Product inventory API is listening on port http://${s.appHost}:${s.appPort}`);
    try {
        await MongoDb.connect(ConnStr(
            s.dbUser,
            s.dbPass,
            s.dbPort,
            s.dbHost,
            s.dbName
        ));
        console.info('Connected to MongoDb')
    } catch (err) {
        console.log(err);
    }
});
