import "express-async-errors";
import express, { NextFunction, Request, Response } from 'express';

import { routes } from './routes';
import { AppError } from "./errors/AppError";
import { HandleEvents } from "./events/HandleEvents";

import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1', routes);

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: "error",
            message: err.message
        })
    }
    return response.status(500).json({
        status: "error",
        message: `Internal server error - ${err.message}`
    })
})

app.listen(process.env.PORT, () => {
    const interval = process.env.UPDATE_INTERVAL ?? 1;
    console.log("Servidor rodando na porta " + process.env.PORT);
    setInterval(() => { const handleEvents = new HandleEvents(); handleEvents.execute(); }, Number(interval) * 1000);
})