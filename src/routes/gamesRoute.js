import express from "express";
import { getGames, postGame } from "../controllers/gamesController.js";

const gamesRoute = express.Router();

gamesRoute.get('/games', getGames);

gamesRoute.post('/games', postGame);

export default gamesRoute;