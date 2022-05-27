import express from "express";
import gamesRoute from "./gamesRoute.js";
import categoriesRoute from "./categoriesRoute.js";

const routes = express.Router();
routes.use(gamesRoute);
routes.use(categoriesRoute);

export default routes;