import { User } from "@prisma/client";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../prisma/client";
import { CreateUserDTO } from "./dtos/CreateUserDTO";
import { DeleteUserDTO } from "./dtos/DeleteUserDTO";
import { FindUserDTO } from "./dtos/FindUserDTO";

export class UserUseCase {

    async create({ name, email, password, cpfCnpj, adress }: CreateUserDTO): Promise<User> {

        const userAlreadyExists = await prisma.user.findUnique({
            where: {
                cpfCnpj
            }
        });
        if (userAlreadyExists) {
            throw new AppError("User already exists!");
        }

        const user = await prisma.user.create({
            data: {
                name, email, password, cpfCnpj, adress
            }
        });

        return user;
    }

    async delete({ id }: DeleteUserDTO): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });

        if (!user) {
            throw new AppError("User does not exists!");
        }

        await prisma.user.delete({
            where: {
                id
            }
        });

        return true;
    }

    async list(): Promise<User[]> {
        const users = await prisma.user.findMany();

        if (!users) {
            throw new AppError("Does not exists users!");
        }

        return users;
    }

    async find({ id }: FindUserDTO): Promise<User> {
        const user = await prisma.user.findUnique({
            where: {
                id
            }, include: {
                customers: true
            }
        });

        if (!user) {
            throw new AppError("User does not exists");
        }

        return user;
    }

    async balance({ id }: FindUserDTO): Promise<any> {
        var balance:decimal = 0.0;

        const user = await prisma.user.findUnique({
            where: {
                id
            }, include: {
                customers: true
            }
        });

        if (!user) {
            throw new AppError("User does not exists");
        }

        const customers = user.customers;
        customers.map(async (customer) => {
            const payments = await prisma.payment.findMany({
                where: {
                    customerId: customer.id,
                    status: {
                        contains: "RECEIVED"
                    }
                }
            });

            if(payments){
                payments.map((payment)=>{
                    balance = balance+(payment.value);
                })
            }
        })

        return {balance};
    }



}