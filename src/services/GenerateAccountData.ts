import { prisma } from "../prisma/client";
import { AccountCodeDTO } from "./dtos/AccountCodeDTO";

export class GenerateAccountData{
    async execute(){
        const {code,digit} = await this.generateCode();

        return {code,digit};
    }
    async generateCode():Promise<any> {
        var tryCode = String(Math.floor(Math.random() * 10000) + 1);


        const { code, digit } = await this.generateDigit({ code: tryCode });

        return {code,digit};
    }

    async generateDigit({code}:AccountCodeDTO):Promise<any>{
        const digit = String(Math.floor(Math.random() * 10) + 1);

        const account = await prisma.account.findFirst({
            where:{
                code,digit
            }
        });

        if(account){
            await this.generateCode();
        }

        return {code,digit};
    }
}