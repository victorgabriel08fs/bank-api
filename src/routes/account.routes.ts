import { Router } from "express";
import { AccountController } from "../modules/accounts/AccountController";

const accountController = new AccountController();

const accountRoutes = Router();

accountRoutes.post("/", accountController.create);
// accountRoutes.get("/", accountController.list);
// accountRoutes.get("/:id", accountController.find);
// accountRoutes.delete("/:id", accountController.delete);
accountRoutes.get("/balance/:userId",accountController.balance);

export { accountRoutes };