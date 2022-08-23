import { Customer } from "@prisma/client";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../prisma/client";
import { CreateCustomerDTO } from "./dtos/CreateCustomerDTO";
import { DeleteCustomerDTO } from "./dtos/DeleteCustomerDTO";
import { FindCustomerDTO } from "./dtos/FindCustomerDTO";

export class CustomerUseCase {
    async create({ name, email, cpfCnpj, adress, userId }: CreateCustomerDTO): Promise<Customer> {

        const customerAlreadyExists = await prisma.customer.findFirst({
            where: {
                email, userId
            }
        });
        if (customerAlreadyExists) {
            throw new AppError("Customer already exists!");
        }

        const customer = await prisma.customer.create({
            data: {
                name, email, cpfCnpj, adress, userId
            }
        });

        return customer;
    }

    async delete({ id }: DeleteCustomerDTO): Promise<boolean> {
        const customer = await prisma.customer.findUnique({
            where: {
                id
            }
        });

        if (!customer) {
            throw new AppError("Customer does not exists!");
        }

        await prisma.customer.delete({
            where: {
                id
            }
        });

        return true;
    }

    async list(): Promise<Customer[]> {
        const customers = await prisma.customer.findMany();

        if (!customers) {
            throw new AppError("Does not exists customers!");
        }

        return customers;
    }

    async find({ id }: FindCustomerDTO): Promise<Customer> {
        const customer = await prisma.customer.findUnique({
            where: {
                id
            }, include: {
                payments: true,
                user:true
            }
        });

        if (!customer) {
            throw new AppError("Customer does not exists");
        }

        return customer;
    }

}