import express from "express";
import { deleteRental, getRentals, postRental, postRentalId } from "../controllers/rentalsControllers.js";

const rentalsRoute = express.Router();

rentalsRoute.get('/rentals', getRentals);

rentalsRoute.post('/rentals', postRental);

rentalsRoute.post('/rentals/:id/return', postRentalId);

rentalsRoute.delete('/rentals/:id', deleteRental)

export default rentalsRoute;