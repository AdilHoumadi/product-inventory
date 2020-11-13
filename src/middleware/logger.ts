import {Request, Response, NextFunction} from 'express';

const logger = (req: Request, res: Response, next: NextFunction) => {
    const logLine = `${req.ip} - [${new Date().toUTCString()}] "${req.method} ${req.originalUrl}"`
    console.info(logLine);
    const start = new Date().getTime();
    res.on('finish', () => {
        const duration = new Date().getTime() - start;
        console.info(`${logLine} - ${res.statusCode} ${duration}ms`);
    });
    next();
}
export {logger};