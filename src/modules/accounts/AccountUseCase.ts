import { CreateAccountDTO } from "./dtos/CreateAccountDTO";
import {Account} from "@prisma/client";
import { prisma } from "../../prisma/client";
import { AppError } from "../../errors/AppError";

export class AccountUseCase{
    async create({userId}:CreateAccountDTO):Promise<Account>{
        const accountAlreadyExists = await prisma.account.findFirst({
            where:{
                userId
            }
        })

        if(accountAlreadyExists){
            throw new AppError("Account already exists");
        }

        const code = "001231231";
        const digit = "01";
        
        const account = await prisma.account.create({
            data:{
                userId,code,digit
            }
        });

        return account;
    }
}