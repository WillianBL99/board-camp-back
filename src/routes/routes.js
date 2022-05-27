import express from "express";
import gamesRoute from "./gamesRoute.js";
import categoriesRoute from "./categoriesRoute.js";
import customersRoute from "./customersRoute.js";

const routes = express.Router();
routes.use(gamesRoute);
routes.use(categoriesRoute);
routes.use(customersRoute);

export default routes;