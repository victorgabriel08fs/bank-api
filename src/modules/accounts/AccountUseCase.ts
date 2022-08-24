import { CreateAccountDTO } from "./dtos/CreateAccountDTO";
import { Account } from "@prisma/client";
import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppError";

export class AccountUseCase {
    async create({ userId }: CreateAccountDTO): Promise<Account> {
        const accountAlreadyExists = await prisma.account.findFirst({
            where: {
                userId
            }
        })

        if (accountAlreadyExists) {
            throw new AppError("Account already exists");
        }

        const code = "001231231";
        const digit = "01";

        const account = await prisma.account.create({
            data: {
                userId, code, digit
            }
        });

        return account;
    }

    async balance({ userId }) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            throw new AppError("User does not exists");
        }

        const account = await prisma.account.findFirst({
            where: {
                userId
            }
        });

        if (!account) {
            throw new AppError("Account does not exists");
        }

        const val = account.balance;
        const balance = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val))
        return { balance };
    }

    async changeStatus({ id, status }) {
        const account = await prisma.account.findUnique({
            where: {
                id
            }
        });

        if (!account) {
            throw new AppError("Account does not exists");
        }

        if (!account.status && !status) {
            throw new AppError("Account is already disabled");
        } else if (account.status && status) {
            throw new AppError("Account is already enabled");
        }

        await prisma.account.update({
            data: {
                status
            },
            where: {
                id
            }
        });

        const message = (status ? 'enabled' : 'disabled');

        return { message };
    }
}