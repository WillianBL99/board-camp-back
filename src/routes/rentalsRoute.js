import express from "express";
import { deleteRental, getRentals, postRental, postRentalId } from "../controllers/rentalsControllers.js";
import { getRentalMiddleWare, postRentalIdMiddleWare, postRentalMiddleWare } from "../middlewares/rentalsMiddleWare.js";

const rentalsRoute = express.Router();

rentalsRoute.get('/rentals',getRentalMiddleWare, getRentals);

rentalsRoute.post('/rentals', postRentalMiddleWare, postRental);

rentalsRoute.post('/rentals/:id/return',postRentalIdMiddleWare, postRentalId);

rentalsRoute.delete('/rentals/:id', deleteRental)

export default rentalsRoute;