import * as mongoose from 'mongoose';

export class Mongoose {
    public static connect(url: string) {
        mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true}).then((data) => {
            return data
        });
        mongoose.connection.on('open', () => {
            console.log('Connected to MongoDB');
        });
        mongoose.connection.on('error', (err: any) => {
            console.error(err);
        });
        return mongoose.connection;
    }
}