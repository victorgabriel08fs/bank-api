import { Customer, User } from "@prisma/client";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../prisma/client";
import { GenerateAccountData } from "../../services/GenerateAccountData";
import { CreateUserDTO } from "./dtos/CreateUserDTO";
import { DeleteUserDTO } from "./dtos/DeleteUserDTO";
import { FindUserDTO } from "./dtos/FindUserDTO";

export class UserUseCase {

    async create({ name, email, password, cpfCnpj, adress }: CreateUserDTO): Promise<any> {

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

        const generateAccountData = new GenerateAccountData();
        const { code, digit } = (await generateAccountData.execute());

        const account = await prisma.account.create({
            data: {
                userId: user.id, code, digit
            }
        });

        return { user, account };
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
        const users = await prisma.user.findMany({
            include: {
                customers: true,
                account: true
            }
        });


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
                customers: true,
                account: true
            }
        });

        if (!user) {
            throw new AppError("User does not exists");
        }

        return user;
    }

    async customers({ id }: FindUserDTO): Promise<Customer[]> {
        const customers = await prisma.customer.findMany({
            where: {
                userId: id
            }, include: {
                payments: true,
            }
        });

        if (!customers) {
            throw new AppError("User does not exists");
        }

        return customers;
    }

}