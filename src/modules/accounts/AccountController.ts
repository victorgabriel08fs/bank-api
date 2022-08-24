import { Request, Response } from "express";
import { AccountUseCase } from "./AccountUseCase";

export class AccountController {
    async create(req: Request, res: Response): Promise<any> {
        const accountUseCase = new AccountUseCase();

        const { userId, password } = req.body;

        const result = await accountUseCase.create({ userId });

        return res.status(201).json(result);
    }

    async balance(req:Request,res:Response):Promise<any>{
        const accountUseCase = new AccountUseCase();

        const {userId} = req.params;

        const result = await accountUseCase.balance({userId});

        return res.status(200).json(result);
    }
}