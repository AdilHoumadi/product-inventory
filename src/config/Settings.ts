export const ConnStr = (
    user: string,
    pass: string,
    port: number,
    host: string,
    database: string
): string => {
    return `mongodb://${user}:${pass}@${host}:${port}/${database}`
}

export enum Settings {
    // db
    dbUser = 'root',
    dbPass = 'pass',
    dbName = 'product',
    dbHost= 'mongodb',
    dbPort = 27017,
    collection = 'inventory',
    // app
    appPort = 8000,
    appHost= '0.0.0.0',
    // price webservice
    wsHost = 'http://price:3000'
}