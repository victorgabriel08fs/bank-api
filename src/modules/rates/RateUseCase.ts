import { prisma } from "../../prisma/client";
import { CreateRateDTO } from "./dtos/CreateRateDTO";
import { Rate } from '@prisma/client';
import { AppError } from '../../errors/AppError';

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

    async change() {
        const rateUseCase = new RateUseCase();
        const lastRate = await rateUseCase.getLast();
        if (!lastRate) {
            throw new AppError("Rate does not exists");
        }
        const newRate = await prisma.rate.update({
            data: {
                status: !lastRate.status
            },
            where: {
                id: lastRate.id
            }
        });
        const status = newRate.status;
        return { status };
    }
}