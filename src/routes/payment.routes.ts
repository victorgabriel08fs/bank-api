import { Router } from "express";
import { PaymentController } from "../modules/payments/PaymentController";

const paymentController = new PaymentController();

const paymentRoutes = Router();

paymentRoutes.post("/", paymentController.create);
paymentRoutes.get("/", paymentController.list);
paymentRoutes.get("/:id", paymentController.find);
paymentRoutes.delete("/:id", paymentController.delete);
paymentRoutes.patch("/reportPayment",paymentController.reportPayment);

export { paymentRoutes };