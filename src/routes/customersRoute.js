import express from "express";
import { getCustomer, getCustomers, postCustomer, putCustomer } from "../controllers/customersController.js";

const customersRoute = express.Router();

customersRoute.get('/customers', getCustomers);

customersRoute.get('/customers/:id', getCustomer);

customersRoute.post('/customers', postCustomer);

customersRoute.put('/customers/:id', putCustomer);

export default customersRoute;