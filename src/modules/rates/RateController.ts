import { Request, Response } from "express";
import { RateUseCase } from "./RateUseCase";

export class RateController {
    async create(req: Request, res: Response): Promise<any> {
        const rateUseCase = new RateUseCase();

        const { value } = req.body;

        const result = await rateUseCase.create({ value });

        return res.status(201).json(result);
    }

    async getLast(req: Request, res: Response) {
        const rateUseCase = new RateUseCase();

        const result = await rateUseCase.getLast();

        return result.status(200).json(result);
    }
}