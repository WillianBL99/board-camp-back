import express from "express";
import dotenv from "dotenv";

dotenv.config();

const rentalsRoute = express.Router();

rentalsRoute.get('/rentals', (req, res) => {

});

rentalsRoute.post('/rentals/:id',(req, res) => {

});

rentalsRoute.post('/rentals/:id/return',(req, res) => {

});

rentalsRoute.delete('/rentals/:id', (req, res) => {
  
})

export default rentalsRoute;