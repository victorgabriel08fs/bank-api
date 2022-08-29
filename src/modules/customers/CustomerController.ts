import { Request, Response } from "express";
import { CustomerUseCase } from "./CustomerUseCase";

export class CustomerController {

    async create(req: Request, res: Response): Promise<any> {
        const { name, email, cpfCnpj, adress, userId } = req.body;

        const customerUseCase = new CustomerUseCase();
        const result = await customerUseCase.create({ name, email, cpfCnpj, adress, userId });

        return res.status(201).json(result);
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        const customerUseCase = new CustomerUseCase();
        const result = await customerUseCase.delete({ id });

        if (result) {
            return res.status(200).json({ deleted: true });
        }
    }

    async list(req: Request, res: Response): Promise<any> {
        const customerUseCase = new CustomerUseCase();
        const result = await customerUseCase.list();

        return res.status(200).json(result);
    }

    async find(req: Request, res: Response): Promise<any> {
        const customerUseCase = new CustomerUseCase();

        const { id } = req.params;

        const result = await customerUseCase.find({ id });

        return res.status(200).json(result);
    }

    async payments(req: Request, res: Response): Promise<any> {
        const customerUseCase = new CustomerUseCase();

        const { id } = req.params;

        const result = await customerUseCase.payments({ id });

        return res.status(200).json(result);
    }

}