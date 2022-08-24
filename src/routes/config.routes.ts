import { Router } from "express";
import {RateController} from '../modules/rates/RateController';

const rateController = new RateController();

const configRoutes = Router();

configRoutes.post("/rates", rateController.create);

export { configRoutes };