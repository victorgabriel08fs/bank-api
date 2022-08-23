import "express-async-errors";
import express, { NextFunction, Request, Response } from 'express';

import { routes } from './routes';
import { AppError } from "./errors/AppError";

const app = express();

app.use(express.json());

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
    console.log("Servidor rodando na porta " + process.env.PORT);
})