import { Request, Response } from "express";
import { PaymentUseCase } from "./PaymentUseCase";

export class PaymentController {

    async create(req: Request, res: Response): Promise<any> {
        const { customerId, value, billingType, dueDate } = req.body;

        const paymentUseCase = new PaymentUseCase();
        const result = await paymentUseCase.create({ customerId, value, billingType, dueDate });

        return res.status(201).json(result);
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        const paymentUseCase = new PaymentUseCase();
        const result = await paymentUseCase.delete({ id });

        if (result) {
            return res.status(200).json({ deleted: true });
        }
    }

    async list(req: Request, res: Response): Promise<any> {
        const paymentUseCase = new PaymentUseCase();
        const result = await paymentUseCase.list();

        return res.status(200).json(result);
    }

    async find(req: Request, res: Response): Promise<any> {
        const paymentUseCase = new PaymentUseCase();

        const { id } = req.params;

        const result = await paymentUseCase.find({ id });

        return res.status(200).json(result);
    }

}