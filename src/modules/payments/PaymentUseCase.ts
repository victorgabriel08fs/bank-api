import { Payment } from "@prisma/client";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../prisma/client";
import { CreatePaymentDTO } from "./dtos/CreatePaymentDTO";
import { DeletePaymentDTO } from "./dtos/DeletePaymentDTO";
import { FindPaymentDTO } from "./dtos/FindPaymentDTO";

export class PaymentUseCase {
    async create({ customerId, value, billingType, dueDate }: CreatePaymentDTO): Promise<Payment> {

        const customerAlreadyExists = await prisma.customer.findUnique({
            where: {
                id: customerId
            }
        });
        if (!customerAlreadyExists) {
            throw new AppError("Customer does not exists!");
        }

        const payment = await prisma.payment.create({
            data: {
                customerId, value, billingType, dueDate
            }
        });

        return payment;
    }

    async delete({ id }: DeletePaymentDTO): Promise<boolean> {
        const payment = await prisma.payment.findUnique({
            where: {
                id
            }
        });

        if (!payment) {
            throw new AppError("Payment does not exists!");
        }

        await prisma.payment.delete({
            where: {
                id
            }
        });

        return true;
    }

    async list(): Promise<Payment[]> {
        const payments = await prisma.payment.findMany();

        if (!payments) {
            throw new AppError("Does not exists payments!");
        }

        return payments;
    }

    async find({ id }: FindPaymentDTO): Promise<Payment> {
        const payment = await prisma.payment.findUnique({
            where: {
                id
            }, include: {
                customer: true
            }
        });

        if (!payment) {
            throw new AppError("Payment does not exists");
        }

        return payment;
    }

    async reportPayment({ id, status }) {
        const payment = await prisma.payment.findUnique({
            where: id
        });

        if (!payment) {
            throw new AppError("Payment does not exists!");
        }

        var s = "CANCELED";
        var r = null;

        if (status) {
            r = Date.now();
            switch (payment.status) {
                case ("PENDING"):
                    s = "RECEIVED";
                    break;
                case ("OVERDUE"):
                    s = "RECEIVED_OVERDUE";
                    break;
            }
        }

        await prisma.payment.update({
            data: {
                status: s,
                receivedDate: r
            },
            where: {
                id
            }
        });
    }

}