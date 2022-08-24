import { prisma } from "../../prisma/client";
import { CreateRateDTO } from "./dtos/CreateRateDTO";
import { Rate } from '@prisma/client';

export class RateUseCase {
    async create({ value }: CreateRateDTO) {
        const rate = await prisma.rate.create({
            data: {
                value
            }
        });

        return rate;
    }

    async getLast(): Promise<any> {
        const rate = await prisma.rate.findFirst({
            orderBy: {
                created_at: 'desc'
            }
        });

        return rate;
    }
}