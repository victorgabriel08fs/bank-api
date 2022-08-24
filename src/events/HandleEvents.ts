import { prisma } from "../prisma/client";
import moment from "moment";
import { RateUseCase } from "../modules/rates/RateUseCase";

export class HandleEvents {

    async execute() {
        this.updateDueDate();
        this.updateCustomerStatus();
        // this.rate();
    }

    async updateDueDate() {
        const payments = await prisma.payment.findMany({
            where: {
                status: "PENDING"
            }
        });

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
        console.log("updating payments...");
    }

    async updateCustomerStatus() {
        const customers = await prisma.customer.findMany({
            include: {
                payments: true
            }
        });

        customers.map(async (customer) => {
            var status = "NON_DEFAULTING";
            customer.payments.map((payment) => {
                var now = new Date();
                const dif = moment(now).diff(moment(payment.dueDate), 'days');
                if (payment.status == "OVERDUE" && dif > 1) {
                    status = "DEFAULTING";
                }
            });

            if (customer.status != status) {
                await prisma.customer.update({
                    data: {
                        status
                    },
                    where: {
                        id: customer.id
                    }
                });
            }
        });
        console.log("updating customers status...");

    }

    async rate() {
        const accounts = await prisma.account.findMany({
            where: {
                status: true
            }
        });
        const rateUseCase = new RateUseCase();
        const rate = await rateUseCase.getLast();
        if (rate) {
            accounts.map(async (account) => {
                const value = Number(account.balance) + (Number(rate.value) * (Number(account.balance)));
                await prisma.account.update({
                    data: {
                        balance: value
                    },
                    where: {
                        id: account.id
                    }
                });
            });
            console.log("updating rate...");
        }
    }
}