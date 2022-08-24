import { Router } from "express";
import { userRoutes } from "./user.routes";
import { accountRoutes } from "./account.routes";
import { customerRoutes } from "./customer.routes";
import { paymentRoutes } from "./payment.routes";
import { configRoutes } from "./config.routes";

const routes = Router();

routes.use("/accounts", accountRoutes);
routes.use("/users", userRoutes);
routes.use("/customers", customerRoutes);
routes.use("/configs", configRoutes);
routes.use("/payments", paymentRoutes);

export { routes };