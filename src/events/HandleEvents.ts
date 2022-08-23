import { prisma } from "../prisma/client";
import moment from "moment";

export class HandleEvents {
    async updateDueDate() {
        const payments = await prisma.payment.findMany({
            where: {
                status: "PENDING"
            }
        });
        
        console.log("updating payments...");
        payments.map(async (payment) => {
            var now = new Date();
            const dif = moment(payment.dueDate).diff(moment(now));
            if (dif < 0) {
                await prisma.payment.update({
                    data: {
                        status: 'OVERDUE'
                    },
                    where: {
                        id: payment.id
                    }
                });
            }
        });
    }
}