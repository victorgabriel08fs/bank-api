import { Payment } from "@prisma/client";
import moment from "moment";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../prisma/client";
import { CreatePaymentDTO } from "./dtos/CreatePaymentDTO";
import { DeletePaymentDTO } from "./dtos/DeletePaymentDTO";
import { FindPaymentDTO } from "./dtos/FindPaymentDTO";
import { NewDueDatePaymentDTO } from "./dtos/NewDueDatePaymentDTO";
import { ReportPaymentDTO } from "./dtos/ReportPaymentDTO";

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

    async reportPayment({ id, status }: ReportPaymentDTO): Promise<Payment> {
        const payment = await prisma.payment.findUnique({
            where: { id }
        });

        if (!payment) {
            throw new AppError("Payment does not exists!");
        }

        if (payment.status == "REVERSED") {
            throw new AppError("Payment is was reversed!");
        }

        if ((payment.status == "RECEIVED" || payment.status == "RECEIVED_OVERDUE") && status) {
            throw new AppError("Payment is already received!");
        }

        var newStatus = "CANCELED";
        var receivedDate = null;

        if (status) {
            receivedDate = new Date();

            switch (payment.status) {
                case ("PENDING"):
                    newStatus = "RECEIVED";
                    break;
                case ("OVERDUE"):
                    newStatus = "RECEIVED_OVERDUE";
                    break;
            }
        } else {
            if ("RECEIVED" || "RECEIVED_OVERDUE")
                newStatus = "REVERSED"
        }



        const updatedPayment = await prisma.payment.update({
            data: {
                status: newStatus,
                receivedDate: receivedDate
            },
            where: {
                id
            }
        });
        if (updatedPayment.customerId == null) {
            throw new AppError("Customer does not exists");
        }
        if (updatedPayment.status == "RECEIVED" || updatedPayment.status == "RECEIVED_OVERDUE") {
            const customer = await prisma.customer.findUnique({ where: { id: updatedPayment.customerId }, include: { user: true } });
            if (!customer) {
                throw new AppError("Customer does not exists");
            }
            if (customer.userId == null) {
                throw new AppError("User does not exists");
            }
            const user = await prisma.user.findUnique({
                where: {
                    id: customer.userId
                }, include: {
                    account: true
                }
            });
            if (!user) {
                throw new AppError("User does not exists");
            }
            if (user.account == null) {
                throw new AppError("Account does not exists");
            }
            const account = await prisma.account.findUnique({
                where: {
                    id: user.account.id
                }
            });
            if (account) {
                const value = Number(account.balance) + Number(updatedPayment.value);
                const updatedAccount = await prisma.account.update({
                    data: {
                        balance: value
                    },
                    where: {
                        id: account.id
                    }
                })
            }

        } else {
            const customer = await prisma.customer.findUnique({ where: { id: updatedPayment.customerId }, include: { user: true } });
            if (!customer) {
                throw new AppError("Customer does not exists");
            }
            if (customer.userId == null) {
                throw new AppError("User does not exists");
            }
            const user = await prisma.user.findUnique({
                where: {
                    id: customer.userId
                }, include: {
                    account: true
                }
            });
            if (!user) {
                throw new AppError("User does not exists");
            }
            if (user.account == null) {
                throw new AppError("Account does not exists");
            }
            const account = await prisma.account.findUnique({
                where: {
                    id: user.account.id
                }
            });
            if (account) {
                const value = Number(account.balance) - Number(updatedPayment.value);
                const updatedAccount = await prisma.account.update({
                    data: {
                        balance: value
                    },
                    where: {
                        id: account.id
                    }
                })
            }
        }

        return updatedPayment;

    }

    async newDueDate({ id }: NewDueDatePaymentDTO) {
        const payment = await prisma.payment.findUnique({
            where: { id }
        });

        if (!payment) {
            throw new AppError("Payment does not exists!");
        }
        const todayDate = new Date();
        const dif = moment(payment.updated_at).diff(todayDate, 'days');

        if (payment.status != "OVERDUE" && (payment.status == "PENDING" && dif == 0)) {
            throw new AppError("Payment cannot be postponed!");
        }

        const addDueDate = moment(todayDate).add(3, 'days');
        const newDueDate = addDueDate.toDate();

        const status = "PENDING";

        const updatedPayment = await prisma.payment.update({
            data: {
                dueDate: newDueDate, status
            },
            where: {
                id
            }
        });

        return updatedPayment;

    }

}