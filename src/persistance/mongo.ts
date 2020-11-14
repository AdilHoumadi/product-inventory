import * as mongodb from 'mongodb';

export class MongoDb {
    public static client: mongodb.MongoClient
    public static connect(url: string) {
        return new Promise((resolve, reject) => {
            mongodb.connect(url, { useUnifiedTopology: true }, (err, client: mongodb.MongoClient) => {
                if(err) {
                    reject(err);
                } else {
                    MongoDb.client = client;
                    resolve(client);
                }
            });
        });
    }
}