import express from "express";
import gamesRoute from "./gamesRoute.js";

const routes = express.Router();
routes.use(gamesRoute);

export default routes;