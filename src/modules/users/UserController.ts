import { Request, Response } from "express";
import { UserUseCase } from "./UserUseCase";

export class UserController {

    async create(req: Request, res: Response): Promise<any> {
        const { name, email, password, cpfCnpj, adress } = req.body;

        const userUseCase = new UserUseCase();
        const result = await userUseCase.create({ name, email, password, cpfCnpj, adress });

        return res.status(201).json(result);
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        const userUseCase = new UserUseCase();
        const result = await userUseCase.delete({ id });

        if (result) {
            return res.status(200).json({ deleted: true });
        }
    }

    async list(req: Request, res: Response): Promise<any> {
        const userUseCase = new UserUseCase();
        const result = await userUseCase.list();

        return res.status(200).json(result);
    }

    async find(req: Request, res: Response): Promise<any> {
        const userUseCase = new UserUseCase();

        const { id } = req.params;

        const result = await userUseCase.find({ id });

        return res.status(200).json(result);
    }

    async balance(req:Request,res:Response):Promise<any>{
        const userUseCase = new UserUseCase();

        const {id} = req.params;

        const result = await userUseCase.balance({id});

        return res.status(200).json(result);
    }

}