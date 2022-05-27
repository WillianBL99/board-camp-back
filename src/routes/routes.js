import express from "express";
import gamesRoute from "./gamesRoute.js";
import categoriesRoute from "./categoriesRoute.js";
import customersRoute from "./customersRoute.js";
import rentalsRoute from "./rentalsRoute.js";

const routes = express.Router();
routes.use(gamesRoute);
routes.use(categoriesRoute);
routes.use(customersRoute);
routes.use(rentalsRoute);

export default routes;