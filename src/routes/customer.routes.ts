import { Router } from "express";
import { CustomerController } from "../modules/customers/CustomerController";

const customerController = new CustomerController();

const customerRoutes = Router();

customerRoutes.post("/", customerController.create);
customerRoutes.get("/", customerController.list);
customerRoutes.get("/:id", customerController.find);
customerRoutes.delete("/:id", customerController.delete);

export { customerRoutes };